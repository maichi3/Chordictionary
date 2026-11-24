// 音声ファイル・スマホ録音を解析する。
// Web Audio APIとGoertzel法を使い、音声データはサーバーへ送信しない。

const audioFileInput = document.getElementById("audio-file");
const audioStatus = document.getElementById("audio-status");
const audioResults = document.getElementById("audio-results");

const recordStartButton = document.getElementById("record-start");
const recordStopButton = document.getElementById("record-stop");
const recordStatus = document.getElementById("record-status");

const ANALYSIS_FRAME_SIZE = 8192;
const ANALYSIS_HOP_SIZE = 4096;
const ANALYSIS_WINDOW_SECONDS = 1.0;
const MIN_CHORD_CONFIDENCE = 0.18;

let mediaRecorder = null;
let recordingStream = null;
let recordingChunks = [];

function goertzelMagnitude(samples, frequency, sampleRate) {
    const omega = 2 * Math.PI * frequency / sampleRate;
    const coefficient = 2 * Math.cos(omega);
    let previous = 0;
    let previousPrevious = 0;

    for (let i = 0; i < samples.length; i++) {
        const current = samples[i] + coefficient * previous - previousPrevious;
        previousPrevious = previous;
        previous = current;
    }

    const power = previousPrevious * previousPrevious +
        previous * previous -
        coefficient * previous * previousPrevious;

    return Math.sqrt(Math.max(0, power)) / samples.length;
}

function getFrameChroma(samples, sampleRate) {
    const chroma = Array(12).fill(0);
    const windowed = new Float32Array(samples.length);

    for (let i = 0; i < samples.length; i++) {
        const hann = 0.5 - 0.5 * Math.cos(
            2 * Math.PI * i / Math.max(1, samples.length - 1)
        );
        windowed[i] = samples[i] * hann;
    }

    for (let midi = 36; midi <= 84; midi++) {
        const frequency = 440 * Math.pow(2, (midi - 69) / 12);
        if (frequency * 2 >= sampleRate / 2) continue;

        const fundamental = goertzelMagnitude(windowed, frequency, sampleRate);
        const secondHarmonic = goertzelMagnitude(
            windowed, frequency * 2, sampleRate
        );
        const registerWeight = midi <= 52 ? 1.45 : 1.0;
        chroma[midi % 12] +=
            (fundamental + secondHarmonic * 0.2) * registerWeight;
    }

    const maximum = Math.max(...chroma);
    return maximum > 0 ? chroma.map(value => value / maximum) : chroma;
}

function estimateChord(chroma) {
    const total = chroma.reduce((sum, value) => sum + value, 0);
    if (total < 0.01) return null;

    const candidates = [];

    for (let root = 0; root < 12; root++) {
        for (const pattern of chordPatterns) {
            const chordPitchClasses = pattern.intervals.map(
                interval => (root + interval) % 12
            );

            const inChord = chordPitchClasses.reduce(
                (sum, pitch) => sum + chroma[pitch], 0
            ) / chordPitchClasses.length;

            const outOfChord = chroma.reduce(
                (sum, value, pitch) =>
                    sum + (chordPitchClasses.includes(pitch) ? 0 : value),
                0
            ) / Math.max(1, 12 - chordPitchClasses.length);

            const rootStrength = chroma[root];

            // 4音目以降を含む候補は少しずつ減点し、
            // 音数の多い拡張コードが有利になりすぎないようにする。
            const complexityPenalty =
                Math.max(0, pattern.intervals.length - 3) * 0.025;

            // add系・テンション系は、基本コードより明確な追加音の
            // 根拠がある場合に選ばれるよう、追加の減点を設ける。
            const extensionPenalty =
                /add|9|11|13|♭9|♯9/.test(pattern.suffix) ? 0.035 : 0;

            // susコードには3度が含まれないため、ルートに対する
            // 長3度・短3度の音が十分に検出されている場合は、
            // sus候補を少し下げて通常のメジャー／マイナー系を優先する。
            // 弱い倍音や別パートの音だけでsus判定が崩れないよう、
            // 一定値を超えた分だけ減点する。
            const isSuspended = /^(sus2|sus4|7sus4)$/.test(pattern.suffix);
            const thirdStrength = Math.max(
                chroma[(root + 3) % 12],
                chroma[(root + 4) % 12]
            );
            const suspendedThirdPenalty = isSuspended
                ? Math.max(0, thirdStrength - 0.2) * 0.18
                : 0;

            const score =
                inChord -
                outOfChord * 0.7 +
                rootStrength * 0.12 -
                complexityPenalty -
                extensionPenalty -
                suspendedThirdPenalty;

            candidates.push({ root, pattern, score });
        }
    }

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    if (!best || best.score < MIN_CHORD_CONFIDENCE) return null;

    return {
        name: noteNamesForAudio[best.root] + best.pattern.suffix,
        confidence: Math.max(0, Math.min(1, best.score))
    };
}

const noteNamesForAudio = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

function analyzeAudioBuffer(audioBuffer) {
    const channelCount = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const mono = new Float32Array(length);

    for (let channel = 0; channel < channelCount; channel++) {
        const data = audioBuffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            mono[i] += data[i] / channelCount;
        }
    }

    const frames = [];

    // 最後の端数区間もゼロ埋めして解析し、末尾のコードを落とさない。
    for (let start = 0; start < length; start += ANALYSIS_HOP_SIZE) {
        const actualLength = Math.min(ANALYSIS_FRAME_SIZE, length - start);
        const minimumFrameLength = Math.min(
            ANALYSIS_FRAME_SIZE,
            Math.floor(sampleRate * 0.1)
        );
        if (actualLength < minimumFrameLength) break;

        const frame = new Float32Array(ANALYSIS_FRAME_SIZE);
        frame.set(mono.subarray(start, start + actualLength));

        const chroma = getFrameChroma(frame, sampleRate);
        frames.push({
            time: start / sampleRate,
            endTime: Math.min(length, start + actualLength) / sampleRate,
            chord: estimateChord(chroma)
        });
    }

    return mergeChordFrames(frames);
}

function mergeChordFrames(frames) {
    const groups = [];
    const hopSeconds = frames.length > 1
        ? frames[1].time - frames[0].time
        : ANALYSIS_HOP_SIZE / 44100;
    const windowCount = Math.max(
        1,
        Math.round(ANALYSIS_WINDOW_SECONDS / hopSeconds)
    );

    for (let i = 0; i < frames.length; i += windowCount) {
        const slice = frames.slice(i, i + windowCount);
        const counts = new Map();

        for (const frame of slice) {
            const name = frame.chord ? frame.chord.name : "判定できません";
            counts.set(name, (counts.get(name) || 0) + 1);
        }

        const [name, count] = [...counts.entries()]
            .sort((a, b) => b[1] - a[1])[0];

        if (
            name === "判定できません" ||
            count < Math.ceil(slice.length * 0.6)
        ) {
            continue;
        }

        const start = slice[0].time;
        const end = slice[slice.length - 1].endTime;
        const previous = groups[groups.length - 1];

        if (previous && previous.name === name) {
            previous.end = end;
        } else {
            groups.push({ name, start, end });
        }
    }

    return groups;
}

function formatAudioTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return minutes + ":" + String(remainder).padStart(2, "0");
}

function showAudioResults(groups) {
    audioResults.replaceChildren();

    if (groups.length === 0) {
        audioResults.textContent =
            "コードを判定できませんでした。音量や録音内容を確認してください。";
        return;
    }

    const list = document.createElement("ol");
    list.className = "audio-chord-list";

    groups.forEach(group => {
        const item = document.createElement("li");
        const time = document.createElement("span");
        const chord = document.createElement("button");

        time.textContent =
            formatAudioTime(group.start) + " – " +
            formatAudioTime(group.end);
        chord.type = "button";
        chord.className = "audio-chord-select";
        chord.textContent = group.name;
        chord.title = "クリックしてコード情報と楽器表示に反映";

        chord.addEventListener("click", () => {
            document.querySelectorAll(".audio-chord-select").forEach(button => {
                button.classList.remove("active");
            });
            chord.classList.add("active");

            if (typeof window.selectAnalyzedChord === "function") {
                window.selectAnalyzedChord(group.name);
            }
        });

        item.append(time, chord);
        list.appendChild(item);
    });

    audioResults.appendChild(list);
}

async function processAudioFile(file) {
    if (!file) return;

    if (!file.type.startsWith("audio/") &&
        !/\.(mp3|wav|m4a|aac|ogg|opus|webm)$/i.test(file.name)) {
        audioStatus.textContent = "音声ファイルを選択してください。";
        return;
    }

    audioStatus.textContent = "音声を読み込んで解析しています…";
    audioResults.textContent = "";

    let context;
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            throw new Error("このブラウザはAudioContextに対応していません。");
        }

        context = new AudioContextClass();
        const data = await file.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(data);
        const groups = analyzeAudioBuffer(audioBuffer);

        showAudioResults(groups);
        audioStatus.textContent =
            "解析完了：" + file.name +
            "（" + formatAudioTime(audioBuffer.duration) + "）";
    } catch (error) {
        console.error("音声解析エラー:", error);
        audioStatus.textContent =
            "音声を解析できませんでした。このブラウザで再生できる音声形式か確認してください。";
    } finally {
        if (context && context.state !== "closed") {
            await context.close();
        }
    }
}

audioFileInput.addEventListener("change", event => {
    const file = event.target.files[0];
    if (file) processAudioFile(file);
});

function getSupportedRecordingType() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return "";

    const types = [
        "audio/webm;codecs=opus",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "audio/webm"
    ];

    return types.find(type => MediaRecorder.isTypeSupported(type)) || "";
}

async function startMobileRecording() {
    if (!window.matchMedia("(max-width: 700px)").matches) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia ||
        !window.MediaRecorder) {
        recordStatus.textContent =
            "このブラウザでは録音機能を利用できません。音声ファイルを選択してください。";
        return;
    }

    try {
        recordingStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        });

        const mimeType = getSupportedRecordingType();
        mediaRecorder = mimeType
            ? new MediaRecorder(recordingStream, { mimeType })
            : new MediaRecorder(recordingStream);

        recordingChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
            if (event.data && event.data.size > 0) {
                recordingChunks.push(event.data);
            }
        });

        mediaRecorder.addEventListener("stop", async () => {
            const type = mediaRecorder.mimeType || "audio/webm";
            const extension = type.includes("mp4") ? "m4a" :
                type.includes("ogg") ? "ogg" : "webm";
            const blob = new Blob(recordingChunks, { type });
            const recordedFile = new File(
                [blob],
                "Chordictionary-recording." + extension,
                { type }
            );

            if (recordingStream) {
                recordingStream.getTracks().forEach(track => track.stop());
                recordingStream = null;
            }

            recordStartButton.disabled = false;
            recordStopButton.disabled = true;
            recordStatus.textContent = "録音を終了しました。解析しています…";

            await processAudioFile(recordedFile);
            recordStatus.textContent =
                "録音データの解析が終わりました。もう一度録音することもできます。";
        });

        mediaRecorder.addEventListener("error", event => {
            console.error("録音エラー:", event.error);
            recordStatus.textContent = "録音中にエラーが発生しました。";
            recordStartButton.disabled = false;
            recordStopButton.disabled = true;
        });

        mediaRecorder.start();
        recordStartButton.disabled = true;
        recordStopButton.disabled = false;
        recordStatus.textContent =
            "録音中です。演奏が終わったら「録音停止」を押してください。";
    } catch (error) {
        console.error("マイク利用エラー:", error);
        if (recordingStream) {
            recordingStream.getTracks().forEach(track => track.stop());
            recordingStream = null;
        }
        recordStartButton.disabled = false;
        recordStopButton.disabled = true;
        recordStatus.textContent =
            "マイクを使用できません。ブラウザのマイク許可を確認してください。";
    }
}

function stopMobileRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        recordStopButton.disabled = true;
        mediaRecorder.stop();
    }
}

if (recordStartButton && recordStopButton && recordStatus) {
    recordStartButton.addEventListener("click", startMobileRecording);
    recordStopButton.addEventListener("click", stopMobileRecording);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia ||
        !window.MediaRecorder) {
        recordStartButton.disabled = true;
        recordStatus.textContent =
            "このブラウザは録音に対応していません。音声ファイルを選択してください。";
    }
}


// 説明カードの動作：すべての端末で初期状態は展開。
// PC・タブレットでは常時展開し、スマホでは各カードを個別に折りたためる。
const descriptionMediaQuery = window.matchMedia("(max-width: 700px)");
const allDescriptionCards = document.querySelectorAll(".feature-description");

function syncDescriptionCards() {
    if (!descriptionMediaQuery.matches) {
        allDescriptionCards.forEach(card => {
            card.open = true;
        });
    }
}

allDescriptionCards.forEach(card => {
    card.addEventListener("toggle", () => {
        if (!descriptionMediaQuery.matches && !card.open) {
            card.open = true;
        }
    });
});

syncDescriptionCards();
if (descriptionMediaQuery.addEventListener) {
    descriptionMediaQuery.addEventListener("change", syncDescriptionCards);
} else if (descriptionMediaQuery.addListener) {
    descriptionMediaQuery.addListener(syncDescriptionCards);
}
