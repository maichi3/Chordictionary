// MP3音声を読み込み、短い区間ごとにコードを推定する
// 外部ライブラリを使わず、Web Audio APIとGoertzel法で解析する。

const audioFileInput = document.getElementById("audio-file");
const audioStatus = document.getElementById("audio-status");
const audioResults = document.getElementById("audio-results");

const ANALYSIS_FRAME_SIZE = 4096;
const ANALYSIS_HOP_SIZE = 4096;
const ANALYSIS_WINDOW_SECONDS = 0.8;
const MIN_CHORD_CONFIDENCE = 0.16;

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
    const firstMidi = 36;
    const lastMidi = 84;

    for (let midi = firstMidi; midi <= lastMidi; midi++) {
        const frequency = 440 * Math.pow(2, (midi - 69) / 12);
        if (frequency * 2 >= sampleRate / 2) continue;

        const fundamental = goertzelMagnitude(samples, frequency, sampleRate);
        const secondHarmonic = goertzelMagnitude(samples, frequency * 2, sampleRate);
        const energy = fundamental + secondHarmonic * 0.35;
        chroma[midi % 12] += energy;
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

            const score = inChord - outOfChord * 0.55;
            candidates.push({ root, pattern, score });
        }
    }

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    if (!best || best.score < MIN_CHORD_CONFIDENCE) return null;

    const rootName = noteNamesForAudio[best.root];
    return {
        name: rootName + best.pattern.suffix,
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
    const mono = new Float32Array(length);

    for (let channel = 0; channel < channelCount; channel++) {
        const data = audioBuffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            mono[i] += data[i] / channelCount;
        }
    }

    const frames = [];
    for (
        let start = 0;
        start + ANALYSIS_FRAME_SIZE <= length;
        start += ANALYSIS_HOP_SIZE
    ) {
        const frame = mono.slice(start, start + ANALYSIS_FRAME_SIZE);
        const chroma = getFrameChroma(frame, audioBuffer.sampleRate);
        frames.push({
            time: start / audioBuffer.sampleRate,
            chord: estimateChord(chroma)
        });
    }

    return mergeChordFrames(frames, audioBuffer.sampleRate);
}

function mergeChordFrames(frames, sampleRate) {
    const groups = [];
    const windowCount = Math.max(
        1,
        Math.round(ANALYSIS_WINDOW_SECONDS /
            (ANALYSIS_HOP_SIZE / sampleRate))
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

        const start = slice[0].time;
        const end = slice[slice.length - 1].time +
            ANALYSIS_HOP_SIZE / 44100;

        if (name !== "判定できません") {
            const previous = groups[groups.length - 1];
            if (previous && previous.name === name) {
                previous.end = end;
            } else {
                groups.push({ name, start, end });
            }
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
        const chord = document.createElement("strong");

        time.textContent =
            formatAudioTime(group.start) + " – " +
            formatAudioTime(group.end);
        chord.textContent = group.name;

        item.append(time, chord);
        list.appendChild(item);
    });

    audioResults.appendChild(list);
}

audioFileInput.addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;

    if (!/\.mp3$/i.test(file.name) &&
        file.type !== "audio/mpeg") {
        audioStatus.textContent = "MP3ファイルを選択してください。";
        audioFileInput.value = "";
        return;
    }

    audioStatus.textContent = "音声を読み込んで解析しています…";
    audioResults.textContent = "";

    let context;
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;
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
            "音声を解析できませんでした。MP3形式か確認してください。";
    } finally {
        if (context && context.state !== "closed") {
            await context.close();
        }
    }
});
