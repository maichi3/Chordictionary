
console.log(keyNextChords);

const notes = [
    { name: "C", type: "white", frequency: 261.63 },
    { name: "C#", type: "black", position: 0, frequency: 277.18 },
    { name: "D", type: "white", frequency: 293.66 },
    { name: "D#", type: "black", position: 1, frequency: 311.13 },
    { name: "E", type: "white", frequency: 329.63 },
    { name: "F", type: "white", frequency: 349.23 },
    { name: "F#", type: "black", position: 3, frequency: 369.99 },
    { name: "G", type: "white", frequency: 392.00 },
    { name: "G#", type: "black", position: 4, frequency: 415.30 },
    { name: "A", type: "white", frequency: 440.00 },
    { name: "A#", type: "black", position: 5, frequency: 466.16 },
    { name: "B", type: "white", frequency: 493.88 }
];

const keyboard = document.getElementById("keyboard");

const keyboardNotes = [];
const guitarNotes = [];

let selectedInstrument = "keyboard";
let audioSelectedChord = null;

let audioContext = null;

// すべての楽器の選択音をまとめる
function getAllSelectedNotes() {
    // 手入力の判定は、現在選択している楽器の音だけを使う
    if (selectedInstrument === "keyboard") {
        return [...keyboardNotes];
    }

    // ギターは押した位置を個別に保持し、判定にはその位置の音程を渡す
    return guitarNotes
        .map(positionId => {
            const button = [...document.querySelectorAll(".guitar-note")]
                .find(item => item.dataset.positionId === positionId);
            return button ? button.dataset.noteId : null;
        })
        .filter(Boolean);
}

// 音を鳴らす
function playNote(frequency) {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle";

    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );

    gainNode.gain.setValueAtTime(
        0.4,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
}

// 鍵盤の選択状態を復元する
function restoreKeyboardSelection() {
    document.querySelectorAll(".piano-key").forEach(key => {
        const octave = key.dataset.octave;
        const noteName = key.dataset.note;
        const noteId = octave + "-" + noteName;

        key.classList.toggle("selected", keyboardNotes.includes(noteId));
        key.classList.toggle(
            "audio-highlight",
            Boolean(
                audioSelectedChord &&
                Number(octave) === 0 &&
                audioSelectedChord.notes.includes(noteName)
            )
        );
    });
}

// 2オクターブの鍵盤を作る
for (let octave = 0; octave < 2; octave++) {
    notes.forEach(note => {
        const key = document.createElement("button");

        key.type = "button";
        key.textContent = note.name;

        key.classList.add("piano-key", note.type);

        key.dataset.note = note.name;
        key.dataset.octave = octave;

        if (note.type === "white") {
            const whitePosition =
                octave * 7 +
                notes
                    .slice(0, notes.indexOf(note) + 1)
                    .filter(n => n.type === "white")
                    .length - 1;

            key.style.left = (whitePosition * 80) + "px";
        } else {
            key.style.left =
                ((octave * 7 + note.position + 1) * 80 - 25) + "px";
        }

        key.addEventListener("click", () => {
            const frequency =
                octave === 0
                    ? note.frequency
                    : note.frequency * 2;

            playNote(frequency);

            audioSelectedChord = null;
            document.querySelectorAll(".audio-chord-select").forEach(button => {
                button.classList.remove("active");
            });

            const noteId = octave + "-" + note.name;

            if (keyboardNotes.includes(noteId)) {
                const index = keyboardNotes.indexOf(noteId);
                keyboardNotes.splice(index, 1);
                key.classList.remove("selected");
            } else {
                keyboardNotes.push(noteId);
                key.classList.add("selected");
            }

            restoreKeyboardSelection();
            restoreGuitarSelection();
            updateChordDisplay();
        });

        keyboard.appendChild(key);
    });
}

// 楽器の切り替え
const keyboardTab = document.getElementById("keyboard-tab");
const guitarTab = document.getElementById("guitar-tab");

const keyboardPanel = document.getElementById("keyboard-panel");
const guitarPanel = document.getElementById("guitar-panel");

function switchInstrument(instrument) {
    selectedInstrument = instrument;

    const isKeyboard = instrument === "keyboard";

    keyboardPanel.hidden = !isKeyboard;
    guitarPanel.hidden = isKeyboard;

    keyboardTab.classList.toggle("active", isKeyboard);
    guitarTab.classList.toggle("active", !isKeyboard);

    keyboardTab.setAttribute("aria-pressed", String(isKeyboard));
    guitarTab.setAttribute("aria-pressed", String(!isKeyboard));

    // 手入力状態と音声解析のハイライトをそれぞれ保持
    restoreKeyboardSelection();
    restoreGuitarSelection();
}

keyboardTab.addEventListener("click", () => {
    switchInstrument("keyboard");
});

guitarTab.addEventListener("click", () => {
    switchInstrument("guitar");
});

// コード表示用の役割表記
function formatChordRole(chord, keyFunction, fallbackFunction) {
    const keyParts = currentKey.split("-");
    const tonic = keyParts[0];
    const isMinor = keyParts[1] === "minor";

    const majorScale = [0, 2, 4, 5, 7, 9, 11];
    const minorScale = [0, 2, 3, 5, 7, 8, 10];
    const scale = isMinor ? minorScale : majorScale;

    const romanNumerals = [
        "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ"
    ];

    const rootNumber = noteNumbers[chord.root];
    const tonicNumber = noteNumbers[tonic];

    let degree = "";

    if (rootNumber !== undefined && tonicNumber !== undefined) {
        const interval = (rootNumber - tonicNumber + 12) % 12;
        let index = scale.indexOf(interval);

        if (index !== -1) {
            degree = romanNumerals[index];
        } else {
            const nearest = scale.reduce((best, value, i) => {
                const distance = Math.min(
                    (interval - value + 12) % 12,
                    (value - interval + 12) % 12
                );

                return distance < best.distance
                    ? { index: i, distance }
                    : best;
            }, { index: 0, distance: 12 });

            degree = romanNumerals[nearest.index];
        }
    }

    const quality = chord.name
        .slice(chord.root.length)
        .replace(/\/[A-G]#?$/, "");

    const roleMatch = keyFunction
        ? keyFunction.match(/（(.+?)）/)
        : null;

    const role = roleMatch
        ? roleMatch[1]
        : fallbackFunction || "役割不明";

    return degree + quality + "（" + role + "）";
}

// 音声解析で選択されたコード名を、コード情報と各楽器に反映する
function parseAnalyzedChord(chordName) {
    const parts = chordName.split("/");
    const baseName = parts[0];
    const bassName = parts[1] || null;
    const root = [...noteNamesForDisplay]
        .sort((a, b) => b.length - a.length)
        .find(note => baseName.startsWith(note));

    if (!root) return null;

    const suffix = baseName.slice(root.length);
    const pattern = chordPatterns.find(item => item.suffix === suffix);
    if (!pattern) return null;

    const rootNumber = noteNumbers[root];
    const chordNotes = pattern.intervals.map(interval =>
        noteNamesForDisplay[(rootNumber + interval) % 12]
    );

    return {
        name: chordName,
        root,
        bass: bassName || root,
        notes: [...new Set(chordNotes)],
        intervals: pattern.intervals
    };
}

const noteNamesForDisplay = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

function selectAnalyzedChord(chordName) {
    const chord = parseAnalyzedChord(chordName);
    if (!chord) return;

    // 音声解析で選択したコードは、手入力の状態とは分離して保持する
    audioSelectedChord = chord;

    restoreKeyboardSelection();
    restoreGuitarSelection();
    updateChordDisplay();
    const status = document.getElementById("play-chord-status");
    if (status) status.textContent = chord.name + " を選択中です。再生ボタンで音を確認できます。";
}

// 別ファイル（音声解析）から確実に呼び出せるよう公開
window.selectAnalyzedChord = selectAnalyzedChord;

function playSelectedChord() {
    const chord = audioSelectedChord ||
        parseAnalyzedChord(
            detectChord(getAllSelectedNotes())?.name || ""
        );
    const status = document.getElementById("play-chord-status");
    if (!chord) {
        if (status) status.textContent = "先に音声解析のコードをクリックするか、鍵盤・ギターで音を選択してください。";
        return;
    }

    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const now = audioContext.currentTime;
    const notesToPlay = chord.intervals.map(interval =>
        48 + ((noteNumbers[chord.root] + interval) % 12)
    );

    // 分数コードの場合はベース音も加える
    if (chord.bass && chord.bass !== chord.root) {
        const bassMidi = 36 + noteNumbers[chord.bass];
        if (!notesToPlay.includes(bassMidi)) notesToPlay.unshift(bassMidi);
    }

    if (status) status.textContent = chord.name + " を再生しています。";

    notesToPlay.forEach(midiNote => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(
            440 * Math.pow(2, (midiNote - 69) / 12),
            now
        );
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(
            0.13 / notesToPlay.length,
            now + 0.04
        );
        gainNode.gain.setValueAtTime(
            0.13 / notesToPlay.length,
            now + 1.25
        );
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.55);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 1.6);
    });
}

const playChordButton = document.getElementById("play-chord-button");
if (playChordButton) {
    playChordButton.addEventListener("click", playSelectedChord);
}


// 最近選択したコードをブラウザに保存する履歴機能
const CHORD_HISTORY_STORAGE_KEY = "chordictionary-chord-history-v1";
const CHORD_HISTORY_LIMIT = 10;
let chordHistory = loadChordHistory();
let lastRecordedChordName = null;

function loadChordHistory() {
    try {
        const saved = JSON.parse(localStorage.getItem(CHORD_HISTORY_STORAGE_KEY) || "[]");
        return Array.isArray(saved)
            ? saved.filter(item => typeof item === "string" && parseAnalyzedChord(item)).slice(0, CHORD_HISTORY_LIMIT)
            : [];
    } catch (error) {
        console.warn("コード履歴を読み込めませんでした:", error);
        return [];
    }
}

function saveChordHistory() {
    try {
        localStorage.setItem(CHORD_HISTORY_STORAGE_KEY, JSON.stringify(chordHistory));
    } catch (error) {
        console.warn("コード履歴を保存できませんでした:", error);
    }
}

let activeChordHistoryName = null;

function renderChordHistory() {
    const list = document.getElementById("chord-history-list");
    const empty = document.getElementById("chord-history-empty");
    if (!list || !empty) return;
    list.replaceChildren();
    empty.hidden = chordHistory.length > 0;

    chordHistory.forEach(name => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chord-history-item";
        button.textContent = name;
        button.classList.toggle("active", name === activeChordHistoryName);
        button.addEventListener("click", () => {
            activeChordHistoryName = name;
            lastRecordedChordName = null;
            selectAnalyzedChord(name);
            renderChordHistory();
        });
        item.appendChild(button);
        list.appendChild(item);
    });
}

function addChordToHistory(chordName) {
    if (!chordName || !parseAnalyzedChord(chordName)) return;

    activeChordHistoryName = chordName;
    if (chordName === lastRecordedChordName) {
        renderChordHistory();
        return;
    }

    lastRecordedChordName = chordName;
    chordHistory = [chordName, ...chordHistory.filter(name => name !== chordName)]
        .slice(0, CHORD_HISTORY_LIMIT);
    saveChordHistory();
    renderChordHistory();
}

renderChordHistory();

// コード表示を更新
function updateChordDisplay() {
    const chordName = document.getElementById("chord-name");
    const notesDisplay = document.getElementById("notes");
    const functionDisplay = document.getElementById("function");
    const nextChordsDisplay = document.getElementById("next-chords");
    const moodDisplay = document.getElementById("mood");

    const selectedNotes = getAllSelectedNotes();

    if (selectedNotes.length === 0 && !audioSelectedChord) {
        lastRecordedChordName = null;
        activeChordHistoryName = null;
        renderChordHistory();
        chordName.textContent = "---";
        notesDisplay.textContent = "構成音：---";
        functionDisplay.textContent = "---";
        nextChordsDisplay.textContent = "---";
        moodDisplay.textContent = "---";
        if (playChordButton) playChordButton.disabled = false;
        return;
    }

    const chord = audioSelectedChord || detectChord(selectedNotes);
    if (playChordButton) playChordButton.disabled = false;

    const sortedNotes = [...selectedNotes].sort((a, b) => {
        const separatorA = a.lastIndexOf("-");
        const separatorB = b.lastIndexOf("-");
        const octaveA = Number(a.slice(0, separatorA));
        const octaveB = Number(b.slice(0, separatorB));
        const noteA = a.slice(separatorA + 1);
        const noteB = b.slice(separatorB + 1);

        const valueA =
            octaveA * 12 + noteNumbers[noteA];

        const valueB =
            octaveB * 12 + noteNumbers[noteB];

        return valueA - valueB;
    });

    notesDisplay.textContent =
        "構成音：" +
        (audioSelectedChord
            ? audioSelectedChord.notes.join(" - ")
            : sortedNotes.map(note => note.slice(note.lastIndexOf("-") + 1)).join(" - "));

    if (chord) {
        addChordToHistory(chord.name);
        chordName.textContent = chord.name;

        const information = chordDatabase[chord.name];

        if (information) {
            const keyInfo = keyFunctions[currentKey];
            const keyFunction = keyInfo && keyInfo[chord.name];

            functionDisplay.textContent = formatChordRole(
                chord,
                keyFunction,
                information.function
            );

            const keyNext = keyNextChords[currentKey];
            const nextChords = keyNext && keyNext[chord.name];

            nextChordsDisplay.textContent =
                nextChords || information.next;

            moodDisplay.textContent = information.mood;
        } else {
            functionDisplay.textContent = "情報なし";
            nextChordsDisplay.textContent = "情報なし";
            moodDisplay.textContent = "情報なし";
        }
    } else {
        activeChordHistoryName = null;
        renderChordHistory();
        chordName.textContent = "判定できません";
        functionDisplay.textContent = "---";
        nextChordsDisplay.textContent = "---";
        moodDisplay.textContent = "---";
    }
}

// リセット
const resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", () => {
    keyboardNotes.length = 0;
    guitarNotes.length = 0;
    audioSelectedChord = null;
    document.querySelectorAll(".audio-chord-select").forEach(button => {
        button.classList.remove("active");
    });

    document.querySelectorAll(".selected, .audio-highlight").forEach(key => {
        key.classList.remove("selected", "audio-highlight");
    });

    updateChordDisplay();
});

// ギターの選択状態復元用

// ギターの指板を作成
const guitar = document.getElementById("guitar");

const guitarStrings = [
    { name: "1弦 E", value: 16 },
    { name: "2弦 B", value: 11 },
    { name: "3弦 G", value: 7 },
    { name: "4弦 D", value: 2 },
    { name: "5弦 A", value: -3 },
    { name: "6弦 E", value: -8 }
];

const chromaticNotes = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

function restoreGuitarSelection() {
    // 音声解析コードの構成音はピアノだけに表示する。
    // ギターはユーザーが実際にクリックした位置だけを選択表示する。
    document.querySelectorAll(".guitar-note").forEach(button => {
        button.classList.toggle(
            "selected",
            guitarNotes.includes(button.dataset.positionId)
        );
        button.classList.remove("audio-highlight");
    });
}

const markerRow = document.createElement("div");
markerRow.className = "guitar-fret-markers";
const markerSpacer = document.createElement("span");
markerSpacer.className = "guitar-marker-spacer";
markerRow.appendChild(markerSpacer);

for (let fret = 0; fret <= 12; fret++) {
    const cell = document.createElement("span");
    cell.className = "guitar-fret-marker-cell";
    if ([3, 5, 7, 9, 12].includes(fret)) {
        const dot = document.createElement("span");
        dot.className = "guitar-fret-dot" + (fret === 12 ? " double" : "");
        cell.appendChild(dot);
    }
    markerRow.appendChild(cell);
}
guitar.appendChild(markerRow);

guitarStrings.forEach((string, stringIndex) => {
    const row = document.createElement("div");
    row.className = "guitar-string-row";

    const label = document.createElement("span");
    label.className = "guitar-string-label";
    label.textContent = string.name;

    row.appendChild(label);

    for (let fret = 0; fret <= 12; fret++) {
        const value = string.value + fret;

        const octave = Math.floor(value / 12);
        const noteName = chromaticNotes[
            ((value % 12) + 12) % 12
        ];

        const noteId = octave + "-" + noteName;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "guitar-note";
        button.textContent = noteName;
        button.dataset.noteId = noteId;
        // 同じ音程でも弦・フレットが違えば別の選択位置として扱う
        const positionId = stringIndex + "-" + fret;
        button.dataset.positionId = positionId;

        if (fret === 0) {
            button.classList.add("open-string");
        }

        button.addEventListener("click", () => {
            // ギターの開放弦E2を基準に、フレット数から実際の音程を計算
            const guitarFrequency = 82.4069 * Math.pow(2, (value + 8) / 12);
            playNote(guitarFrequency);

            audioSelectedChord = null;
            document.querySelectorAll(".audio-chord-select").forEach(button => {
                button.classList.remove("active");
            });

            if (guitarNotes.includes(positionId)) {
                const index = guitarNotes.indexOf(positionId);
                guitarNotes.splice(index, 1);
            } else {
                guitarNotes.push(positionId);
            }

            restoreKeyboardSelection();
            restoreGuitarSelection();
            updateChordDisplay();
        });

        row.appendChild(button);
    }

    guitar.appendChild(row);
});

restoreGuitarSelection();
updateChordDisplay();

const explanationCard = document.querySelector(".feature-description");
const phoneLayout = window.matchMedia("(max-width: 700px)");

function syncExplanationCard(event) {
    if (!explanationCard) return;
    explanationCard.open = !event.matches;
}

syncExplanationCard(phoneLayout);
if (phoneLayout.addEventListener) {
    phoneLayout.addEventListener("change", syncExplanationCard);
} else {
    phoneLayout.addListener(syncExplanationCard);
}
