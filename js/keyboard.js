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

    // 初回クリック時に音声システムを作る
    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    // 音声を再開
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

            // 音を鳴らす
            playNote(note.frequency);

            const noteName = note.name;

            // 選択・解除
            if (selectedNotes.includes(noteName)) {

                selectedNotes = selectedNotes.filter(
                    selected => selected !== noteName
                );

                key.classList.remove("selected");

            } else {

                selectedNotes.push(noteName);

                key.classList.add("selected");
            }

            updateChordDisplay();
        });

        keyboard.appendChild(key);
    });
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


    const chord =
        detectChord(selectedNotes);


    notesDisplay.textContent =
        "構成音：" +
        selectedNotes.join(" - ");


    if (chord) {

        chordName.textContent =
            chord.name;

        const information =
            chordDatabase[chord.name];


        if (information) {

            functionDisplay.textContent =
                information.function;

            nextChordsDisplay.textContent =
                information.next;

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

        functionDisplay.textContent = "---";

        nextChordsDisplay.textContent = "---";

        moodDisplay.textContent = "---";
    }
}