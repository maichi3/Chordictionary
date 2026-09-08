const notes = [
    { name: "C", type: "white" },
    { name: "C#", type: "black", position: 0 },
    { name: "D", type: "white" },
    { name: "D#", type: "black", position: 1 },
    { name: "E", type: "white" },
    { name: "F", type: "white" },
    { name: "F#", type: "black", position: 3 },
    { name: "G", type: "white" },
    { name: "G#", type: "black", position: 4 },
    { name: "A", type: "white" },
    { name: "A#", type: "black", position: 5 },
    { name: "B", type: "white" }
];

const keyboard = document.getElementById("keyboard");

let selectedNotes = [];

let whiteIndex = 0;


// =========================
// 鍵盤を作る
// =========================

notes.forEach(note => {

    const key = document.createElement("button");

    key.textContent = note.name;

    key.classList.add("piano-key");
    key.classList.add(note.type);

    key.dataset.note = note.name;


    // 白鍵の位置
    if (note.type === "white") {

        key.style.left = (whiteIndex * 80) + "px";

        whiteIndex++;

    }

    // 黒鍵の位置
    else {

        key.style.left =
            ((note.position + 1) * 80 - 25) + "px";
    }


    // =========================
    // 鍵盤クリック
    // =========================

    key.addEventListener("click", () => {

        const noteName = note.name;


        // 選択されている場合
        if (selectedNotes.includes(noteName)) {

            selectedNotes = selectedNotes.filter(
                selected => selected !== noteName
            );

            key.classList.remove("selected");

        }

        // 選択されていない場合
        else {

            selectedNotes.push(noteName);

            key.classList.add("selected");
        }


        updateChordDisplay();
    });


    keyboard.appendChild(key);
});


// =========================
// コード表示
// =========================

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


    // 音が選択されていない
    if (selectedNotes.length === 0) {

        chordName.textContent = "---";

        notesDisplay.textContent =
            "構成音：---";

        functionDisplay.textContent =
            "---";

        nextChordsDisplay.textContent =
            "---";

        moodDisplay.textContent =
            "---";

        return;
    }


    // コードを判定
    const chord =
        detectChord(selectedNotes);


    // 構成音を表示
    notesDisplay.textContent =
        "構成音：" +
        selectedNotes.join(" - ");


    // コードが判定できた
    if (chord) {

        chordName.textContent =
            chord.name;


        // コード辞典から情報を取得
        const information =
            chordDatabase[chord.name];


        if (information) {

            functionDisplay.textContent =
                information.function;

            nextChordsDisplay.textContent =
                information.next;

            moodDisplay.textContent =
                information.mood;

        }

        else {

            functionDisplay.textContent =
                "情報なし";

            nextChordsDisplay.textContent =
                "情報なし";

            moodDisplay.textContent =
                "情報なし";
        }

    }

    // コードとして判定できない
    else {

        chordName.textContent =
            "判定できません";

        functionDisplay.textContent =
            "---";

        nextChordsDisplay.textContent =
            "---";

        moodDisplay.textContent =
            "---";
    }
}