const chordPatterns = [
    {
        suffix: "",
        intervals: [0, 4, 7]
    },
    {
        suffix: "m",
        intervals: [0, 3, 7]
    },
    {
        suffix: "dim",
        intervals: [0, 3, 6]
    },
    {
        suffix: "aug",
        intervals: [0, 4, 8]
    },
    {
        suffix: "7",
        intervals: [0, 4, 7, 10]
    },
    {
        suffix: "maj7",
        intervals: [0, 4, 7, 11]
    },
    {
        suffix: "m7",
        intervals: [0, 3, 7, 10]
    },
    {
        suffix: "m7♭5",
        intervals: [0, 3, 6, 10]
    }
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

    const noteValues = selectedNotes
        .map(note => noteNumbers[note])
        .sort((a, b) => a - b);


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

                return {
                    name: rootName + pattern.suffix,
                    root: rootName,
                    notes: selectedNotes,
                    intervals: pattern.intervals
                };
            }
        }
    }

    return null;
}