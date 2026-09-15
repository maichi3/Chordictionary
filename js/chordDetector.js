const chordPatterns = [
    // 基本コード
    { suffix: "", intervals: [0, 4, 7] },
    { suffix: "m", intervals: [0, 3, 7] },

    // sus
    { suffix: "sus2", intervals: [0, 2, 7] },
    { suffix: "sus4", intervals: [0, 5, 7] },

    // dim / aug
    { suffix: "dim", intervals: [0, 3, 6] },
    { suffix: "aug", intervals: [0, 4, 8] },

    // 6th
    { suffix: "6", intervals: [0, 4, 7, 9] },
    { suffix: "m6", intervals: [0, 3, 7, 9] },

    // 7th
    { suffix: "7", intervals: [0, 4, 7, 10] },
    { suffix: "maj7", intervals: [0, 4, 7, 11] },
    { suffix: "m7", intervals: [0, 3, 7, 10] },
    { suffix: "m7♭5", intervals: [0, 3, 6, 10] },

    // add9
    { suffix: "add9", intervals: [0, 2, 4, 7] },
    { suffix: "madd9", intervals: [0, 2, 3, 7] }
];

const noteNumbers = {
    "C": 0,
    "C#": 1,
    "D": 2,
    "D#": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "G": 7,
    "G#": 8,
    "A": 9,
    "A#": 10,
    "B": 11
};

function detectChord(selectedNotes) {

    if (selectedNotes.length < 3) {
        return null;
    }

    // 音名と鍵盤上の位置を取得
    const noteData = selectedNotes.map(noteId => {
        const parts = noteId.split("-");
        const octave = Number(parts[0]);
        const noteName = parts[1];

        return {
            name: noteName,
            octave: octave,
            value: octave * 12 + noteNumbers[noteName]
        };
    });

    // 音名を重複なしにする
    const uniqueNotes = [
        ...new Set(noteData.map(note => note.name))
    ];

    if (uniqueNotes.length < 3) {
        return null;
    }

    const noteValues = uniqueNotes
        .map(note => noteNumbers[note])
        .sort((a, b) => a - b);

    // 実際に一番低い鍵盤
    const bass = noteData.reduce((lowest, note) => {
        return note.value < lowest.value ? note : lowest;
    });

    for (const root of noteValues) {

        const intervals = noteValues
            .map(note => (note - root + 12) % 12)
            .sort((a, b) => a - b);

        for (const pattern of chordPatterns) {

            if (
                intervals.length === pattern.intervals.length &&
                intervals.every(
                    (value, index) =>
                        value === pattern.intervals[index]
                )
            ) {

                const rootName = Object.keys(noteNumbers)
                    .find(
                        name => noteNumbers[name] === root
                    );

                let chordName =
                    rootName + pattern.suffix;

                // ルート以外の音が最低音ならオンコード
                if (bass.name !== rootName) {
                    chordName += "/" + bass.name;
                }

                return {
                    name: chordName,
                    root: rootName,
                    bass: bass.name,
                    notes: uniqueNotes,
                    intervals: pattern.intervals
                };
            }
        }
    }

    return null;
}