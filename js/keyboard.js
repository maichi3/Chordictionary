
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

let audioContext = null;

// すべての楽器の選択音をまとめる
function getAllSelectedNotes() {
    return [...keyboardNotes, ...guitarNotes];
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

        key.classList.toggle(
            "selected",
            keyboardNotes.includes(noteId)
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

            const noteId = octave + "-" + note.name;

            if (keyboardNotes.includes(noteId)) {
                const index = keyboardNotes.indexOf(noteId);
                keyboardNotes.splice(index, 1);
                key.classList.remove("selected");
            } else {
                keyboardNotes.push(noteId);
                key.classList.add("selected");
            }

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

    if (isKeyboard) {
        restoreKeyboardSelection();
    } else {
        restoreGuitarSelection();
    }
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

// コード表示を更新
function updateChordDisplay() {
    const chordName = document.getElementById("chord-name");
    const notesDisplay = document.getElementById("notes");
    const functionDisplay = document.getElementById("function");
    const nextChordsDisplay = document.getElementById("next-chords");
    const moodDisplay = document.getElementById("mood");

    const selectedNotes = getAllSelectedNotes();

    if (selectedNotes.length === 0) {
        chordName.textContent = "---";
        notesDisplay.textContent = "構成音：---";
        functionDisplay.textContent = "---";
        nextChordsDisplay.textContent = "---";
        moodDisplay.textContent = "---";
        return;
    }

    const chord = detectChord(selectedNotes);

    const sortedNotes = [...selectedNotes].sort((a, b) => {
        const [octaveA, noteA] = a.split("-");
        const [octaveB, noteB] = b.split("-");

        const valueA =
            Number(octaveA) * 12 + noteNumbers[noteA];

        const valueB =
            Number(octaveB) * 12 + noteNumbers[noteB];

        return valueA - valueB;
    });

    notesDisplay.textContent =
        "構成音：" +
        sortedNotes
            .map(note => note.split("-")[1])
            .join(" - ");

    if (chord) {
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

    document.querySelectorAll(".selected").forEach(key => {
        key.classList.remove("selected");
    });

    updateChordDisplay();
});

// ギターの選択状態復元用

// ギターの指板を作成
const guitar = document.getElementById("guitar");

const guitarStrings = [
    { name: "6弦 E", value: -8 },
    { name: "5弦 A", value: -3 },
    { name: "4弦 D", value: 2 },
    { name: "3弦 G", value: 7 },
    { name: "2弦 B", value: 11 },
    { name: "1弦 E", value: 16 }
];

const chromaticNotes = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

function restoreGuitarSelection() {
    document.querySelectorAll(".guitar-note").forEach(button => {
        button.classList.toggle(
            "selected",
            guitarNotes.includes(button.dataset.noteId)
        );
    });
}

guitarStrings.forEach(string => {
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

        if (fret === 0) {
            button.classList.add("open-string");
        }

        button.addEventListener("click", () => {
            if (guitarNotes.includes(noteId)) {
                const index = guitarNotes.indexOf(noteId);
                guitarNotes.splice(index, 1);
                button.classList.remove("selected");
            } else {
                guitarNotes.push(noteId);
                button.classList.add("selected");
            }

            updateChordDisplay();
        });

        row.appendChild(button);
    }

    guitar.appendChild(row);
});

restoreGuitarSelection();
updateChordDisplay();
