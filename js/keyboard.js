const notes = [
    { name: "C", type: "white" },
    { name: "C#", type: "black" },
    { name: "D", type: "white" },
    { name: "D#", type: "black" },
    { name: "E", type: "white" },
    { name: "F", type: "white" },
    { name: "F#", type: "black" },
    { name: "G", type: "white" },
    { name: "G#", type: "black" },
    { name: "A", type: "white" },
    { name: "A#", type: "black" },
    { name: "B", type: "white" }
];

const keyboard = document.getElementById("keyboard");

let selectedNotes = [];

notes.forEach(note => {

    const key = document.createElement("button");

    key.textContent = note.name;
    key.classList.add("piano-key");

    if (note.type === "black") {
        key.classList.add("black");
    }

    key.addEventListener("click", () => {

        if (selectedNotes.includes(note.name)) {

            selectedNotes = selectedNotes.filter(
                selected => selected !== note.name
            );

            key.classList.remove("selected");

        } else {

            selectedNotes.push(note.name);

            key.classList.add("selected");
        }

        updateChordDisplay();
    });

    keyboard.appendChild(key);
});


function updateChordDisplay() {

    const chordName = document.getElementById("chord-name");
    const notesDisplay = document.getElementById("notes");

    if (selectedNotes.length === 0) {

        chordName.textContent = "---";
        notesDisplay.textContent = "構成音：---";

        return;
    }

    const chord = detectChord(selectedNotes);

    notesDisplay.textContent =
        "構成音：" + selectedNotes.join(" - ");

    if (chord) {

        chordName.textContent = chord.name;

    } else {

        chordName.textContent = "判定できません";
    }
}