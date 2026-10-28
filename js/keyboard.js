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

let selectedNotes = [];

let audioContext = null;

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

    const oscillator =
        audioContext.createOscillator();

    const gainNode =
        audioContext.createGain();

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

    oscillator.stop(
        audioContext.currentTime + 1
    );
}


// 2オクターブの鍵盤を作る
for (let octave = 0; octave < 2; octave++) {

    notes.forEach(note => {

        const key = document.createElement("button");

        key.textContent = note.name;

        key.classList.add("piano-key");
        key.classList.add(note.type);

        key.dataset.note = note.name;

        if (note.type === "white") {

            const whitePosition =
                octave * 7 +
                notes
                    .slice(0, notes.indexOf(note) + 1)
                    .filter(n => n.type === "white")
                    .length - 1;

            key.style.left =
                (whitePosition * 80) + "px";

        } else {

            key.style.left =
                ((octave * 7 + note.position + 1) * 80 - 25) + "px";
        }


        // 鍵盤をクリック
        key.addEventListener("click", () => {

            // ★ 2オクターブ目は周波数を2倍
            const frequency =
                octave === 0
                    ? note.frequency
                    : note.frequency * 2;

            // 音を鳴らす
            playNote(frequency);

           const noteName = note.name;
const noteId = octave + "-" + note.name;

// 選択・解除
if (selectedNotes.includes(noteId)) {

    selectedNotes = selectedNotes.filter(
        selected => selected !== noteId
    );

    key.classList.remove("selected");

} else {

    selectedNotes.push(noteId);

    key.classList.add("selected");
}

            updateChordDisplay();
        });

        keyboard.appendChild(key);
    });
}

function formatChordRole(chord, keyFunction, fallbackFunction) {
    const noteNumbers = {
        C: 0, "C#": 1, D: 2, "D#": 3,
        E: 4, F: 5, "F#": 6, G: 7,
        "G#": 8, A: 9, "A#": 10, B: 11
    };

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

    const chordName =
        document.getElementById("chord-name");

    const notesDisplay =
        document.getElementById("notes");

    const functionDisplay =
        document.getElementById("function");

    const nextChordsDisplay =
        document.getElementById("next-chords");

    const moodDisplay =
        document.getElementById("mood");


    if (selectedNotes.length === 0) {

        chordName.textContent = "---";

        notesDisplay.textContent =
            "構成音：---";

        functionDisplay.textContent = "---";

        nextChordsDisplay.textContent = "---";

        moodDisplay.textContent = "---";

        return;
    }


  const noteNames = [
    ...new Set(
        selectedNotes.map(note => note.split("-")[1])
    )
];

const chord =
    detectChord(selectedNotes);

   const sortedNotes = [...selectedNotes].sort((a, b) => {
    const [octaveA, noteA] = a.split("-");
    const [octaveB, noteB] = b.split("-");

    const valueA = Number(octaveA) * 12 + noteNumbers[noteA];
    const valueB = Number(octaveB) * 12 + noteNumbers[noteB];

    return valueA - valueB;
});

notesDisplay.textContent =
    "構成音：" +
    sortedNotes
        .map(note => note.split("-")[1])
        .join(" - ");
        
   if (chord) {
    chordName.textContent =
        chord.name;

    const information =
        chordDatabase[chord.name];

    if (information) {

        const keyInfo =
            keyFunctions[currentKey];

        const keyFunction =
            keyInfo && keyInfo[chord.name];

       functionDisplay.textContent = formatChordRole(
    chord,
    keyFunction,
    information.function
);

        const keyNext =
            keyNextChords[currentKey];

        const nextChords =
            keyNext && keyNext[chord.name];

        nextChordsDisplay.textContent =
            nextChords || information.next;

        moodDisplay.textContent =
            information.mood;

    } else {
        functionDisplay.textContent =
            "情報なし";

        nextChordsDisplay.textContent =
            "情報なし";

        moodDisplay.textContent =
            "情報なし";
    }

} else {
    chordName.textContent =
        "判定できません";

    functionDisplay.textContent =
        "---";

    nextChordsDisplay.textContent =
        "---";

    moodDisplay.textContent =
        "---";
}
// リセットボタン
const resetButton = document.getElementById("reset-button");

if (resetButton) {
    resetButton.addEventListener("click", () => {

        // 選択した音をすべて解除
        selectedNotes = [];

        // 鍵盤の選択色を解除
        document.querySelectorAll(".piano-key.selected").forEach(key => {
            key.classList.remove("selected");
        });

        // コード表示を初期状態に戻す
        updateChordDisplay();
    });
}
}