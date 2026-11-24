const chordPatterns = [
    // ギターでよく使うパワーコード（ルート＋5度）
    { suffix: "5", intervals: [0, 7] },

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
    { suffix: "7", intervals: [0, 4, 7, 10], optionalIntervals: [7] },
    { suffix: "maj7", intervals: [0, 4, 7, 11], optionalIntervals: [7] },
    { suffix: "m7", intervals: [0, 3, 7, 10], optionalIntervals: [7] },
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
    { suffix: "9", intervals: [0, 2, 4, 7, 10], optionalIntervals: [7] },
    { suffix: "maj9", intervals: [0, 2, 4, 7, 11], optionalIntervals: [7] },
    { suffix: "m9", intervals: [0, 2, 3, 7, 10], optionalIntervals: [7] },
    { suffix: "mMaj9", intervals: [0, 2, 3, 7, 11], optionalIntervals: [7] },
    { suffix: "7♭9", intervals: [0, 1, 4, 7, 10] },
    { suffix: "7♯9", intervals: [0, 3, 4, 7, 10] },

    // 11th系
    { suffix: "11", intervals: [0, 2, 4, 5, 7, 10], optionalIntervals: [7] },
    { suffix: "m11", intervals: [0, 2, 3, 5, 7, 10], optionalIntervals: [7] },

    // 13th系
    // 13thコードはギターでは完全5度と11度を省略することが多い。
    { suffix: "13", intervals: [0, 2, 4, 5, 7, 9, 10], optionalIntervals: [5, 7] },
    { suffix: "maj13", intervals: [0, 2, 4, 5, 7, 9, 11], optionalIntervals: [5, 7] },
    { suffix: "m13", intervals: [0, 2, 3, 5, 7, 9, 10], optionalIntervals: [5, 7] }
];

const noteNumbers = {
    C: 0, "C#": 1, D: 2, "D#": 3,
    E: 4, F: 5, "F#": 6, G: 7,
    "G#": 8, A: 9, "A#": 10, B: 11
};

function detectChord(selectedNotes) {
    if (!Array.isArray(selectedNotes) || selectedNotes.length < 2) return null;

    const noteData = selectedNotes.map(noteId => {
        // 音名は最後のハイフンより後ろ。-1-E のような低音域にも対応する。
        const separator = noteId.lastIndexOf("-");
        const octave = Number(noteId.slice(0, separator));
        const noteName = noteId.slice(separator + 1);

        if (
            separator < 1 ||
            !Number.isInteger(octave) ||
            !Object.prototype.hasOwnProperty.call(noteNumbers, noteName)
        ) {
            return null;
        }

        return {
            name: noteName,
            octave,
            value: octave * 12 + noteNumbers[noteName]
        };
    }).filter(Boolean);

    if (noteData.length < 2) return null;

    // 最も低い実音をベース音として扱う（スラッシュコード判定用）。
    const bass = noteData.reduce((lowest, note) =>
        note.value < lowest.value ? note : lowest
    );

    // 同じ音名を複数弦で押さえても、コード構成音としては1音にまとめる。
    const uniqueNotes = [...new Set(noteData.map(note => note.name))];
    if (uniqueNotes.length < 2) return null;

    const noteValues = uniqueNotes.map(note => noteNumbers[note]);
    const candidates = [];

    for (const root of noteValues) {
        const intervals = noteValues
            .map(note => (note - root + 12) % 12)
            .sort((a, b) => a - b);

        for (const pattern of chordPatterns) {
            // 7th・テンションコードは、ギターのボイシングで省略されやすい音を許容する。
            const optionalIntervals = pattern.optionalIntervals || [];
            const requiredIntervals = pattern.intervals.filter(
                interval => !optionalIntervals.includes(interval)
            );
            const isSubset = intervals.every(interval =>
                pattern.intervals.includes(interval)
            );
            const hasRequiredNotes = requiredIntervals.every(interval =>
                intervals.includes(interval)
            );

            if (!isSubset || !hasRequiredNotes) continue;

            const rootName = Object.keys(noteNumbers)
                .find(name => noteNumbers[name] === root);
            const isSlash = bass.name !== rootName;
            const omittedCount = pattern.intervals.length - intervals.length;

            candidates.push({
                name: rootName + pattern.suffix +
                    (isSlash ? "/" + bass.name : ""),
                root: rootName,
                bass: bass.name,
                notes: uniqueNotes,
                intervals: pattern.intervals,
                score: (isSlash ? 700 : 800) +
                    (pattern.intervals.length * 10) -
                    (omittedCount * 20) -
                    (isSubset && omittedCount > 0 ? 1 : 0)
            });
        }
    }

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0];
}
