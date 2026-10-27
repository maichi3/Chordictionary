
const chordPatterns = [
    // 基本コード
    { suffix: "", intervals: [0, 4, 7] },
    { suffix: "m", intervals: [0, 3, 7] },
    { suffix: "dim", intervals: [0, 3, 6] },
    { suffix: "aug", intervals: [0, 4, 8] },

    // sus
    { suffix: "sus2", intervals: [0, 2, 7] },
    { suffix: "sus4", intervals: [0, 5, 7] },

    // 6th
    { suffix: "6", intervals: [0, 4, 7, 9] },
    { suffix: "m6", intervals: [0, 3, 7, 9] },

    // 7th
    { suffix: "7", intervals: [0, 4, 7, 10] },
    { suffix: "maj7", intervals: [0, 4, 7, 11] },
    { suffix: "m7", intervals: [0, 3, 7, 10] },
    { suffix: "m7♭5", intervals: [0, 3, 6, 10] },
    { suffix: "dim7", intervals: [0, 3, 6, 9] },
    { suffix: "aug7", intervals: [0, 4, 8, 10] },
    { suffix: "7sus4", intervals: [0, 5, 7, 10] },

    // add系
    { suffix: "add9", intervals: [0, 2, 4, 7] },
    { suffix: "madd9", intervals: [0, 2, 3, 7] },
    { suffix: "add11", intervals: [0, 4, 5, 7] },
    { suffix: "madd11", intervals: [0, 3, 5, 7] },
    { suffix: "add13", intervals: [0, 4, 7, 9] },

    // 9th系
    { suffix: "9", intervals: [0, 2, 4, 7, 10] },
    { suffix: "maj9", intervals: [0, 2, 4, 7, 11] },
    { suffix: "m9", intervals: [0, 2, 3, 7, 10] },
    { suffix: "mMaj9", intervals: [0, 2, 3, 7, 11] },
    { suffix: "7♭9", intervals: [0, 1, 4, 7, 10] },
    { suffix: "7♯9", intervals: [0, 3, 4, 7, 10] },

    // 11th系（音を省略しない基本形）
    { suffix: "11", intervals: [0, 2, 4, 5, 7, 10] },
    { suffix: "m11", intervals: [0, 2, 3, 5, 7, 10] },

    // 13th系（音を省略しない基本形）
    { suffix: "13", intervals: [0, 2, 4, 5, 7, 9, 10] },
    { suffix: "maj13", intervals: [0, 2, 4, 5, 7, 9, 11] },
    { suffix: "m13", intervals: [0, 2, 3, 5, 7, 9, 10] }
];

const noteNumbers = {
    C: 0, "C#": 1, D: 2, "D#": 3,
    E: 4, F: 5, "F#": 6, G: 7,
    "G#": 8, A: 9, "A#": 10, B: 11
};

function detectChord(selectedNotes) {
    if (selectedNotes.length < 3) return null;

    const noteData = selectedNotes.map(noteId => {
        const parts = noteId.split("-");
        const octave = Number(parts[0]);
        const noteName = parts[1];

        return {
            name: noteName,
            octave,
            value: octave * 12 + noteNumbers[noteName]
        };
    });

    const bass = noteData.reduce((lowest, note) =>
        note.value < lowest.value ? note : lowest
    );

    const uniqueNotes = [...new Set(noteData.map(note => note.name))];

    if (uniqueNotes.length < 3) return null;

    const noteValues = uniqueNotes.map(note => noteNumbers[note]);
    const candidates = [];

    // すべての音をコードの構成音と照合する
    for (const root of noteValues) {
        const intervals = noteValues
            .map(note => (note - root + 12) % 12)
            .sort((a, b) => a - b);

        for (const pattern of chordPatterns) {
            if (
                intervals.length !== pattern.intervals.length ||
                !intervals.every((value, index) =>
                    value === pattern.intervals[index]
                )
            ) continue;

            const rootName = Object.keys(noteNumbers)
                .find(name => noteNumbers[name] === root);

            const isSlash = bass.name !== rootName;

            candidates.push({
                name: rootName + pattern.suffix +
                    (isSlash ? "/" + bass.name : ""),
                root: rootName,
                bass: bass.name,
                notes: uniqueNotes,
                intervals: pattern.intervals,
                score: isSlash ? 70 : 100
            });
        }
    }

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0];
}
