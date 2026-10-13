const chordDatabase = {};

const noteNames = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

const chordTypes = [
    {
        suffix: "",
        intervals: [0, 4, 7],
        func: "トニック",
        mood: "安定・明るい・落ち着き"
    },
    {
        suffix: "m",
        intervals: [0, 3, 7],
        func: "トニック（マイナー）",
        mood: "暗い・切ない・哀愁"
    },
    {
        suffix: "7",
        intervals: [0, 4, 7, 10],
        func: "ドミナント",
        mood: "緊張感・ブルージー"
    },
    {
        suffix: "maj7",
        intervals: [0, 4, 7, 11],
        func: "トニック系",
        mood: "おしゃれ・浮遊感"
    },
    {
        suffix: "m7",
        intervals: [0, 3, 7, 10],
        func: "トニック / サブドミナント",
        mood: "柔らかい・切ない"
    },
    {
        suffix: "6",
        intervals: [0, 4, 7, 9],
        func: "トニック系",
        mood: "明るい・柔らかい"
    },
    {
        suffix: "m6",
        intervals: [0, 3, 7, 9],
        func: "トニック系",
        mood: "切ない・おしゃれ"
    },
    {
        suffix: "add9",
        intervals: [0, 2, 4, 7],
        func: "トニック系",
        mood: "明るい・透明感"
    },
    {
        suffix: "madd9",
        intervals: [0, 2, 3, 7],
        func: "トニック系",
        mood: "切ない・透明感"
    },
    {
        suffix: "sus2",
        intervals: [0, 2, 7],
        func: "トニック系",
        mood: "開放的・浮遊感"
    },
    {
        suffix: "sus4",
        intervals: [0, 5, 7],
        func: "ドミナント系",
        mood: "緊張感・開放感"
    },
    {
        suffix: "dim",
        intervals: [0, 3, 6],
        func: "ドミナント系",
        mood: "不安・緊張感"
    },
    {
        suffix: "aug",
        intervals: [0, 4, 8],
        func: "ドミナント系",
        mood: "不思議・不安定"
    },
    {
        suffix: "m7♭5",
        intervals: [0, 3, 6, 10],
        func: "ドミナント系",
        mood: "暗い・緊張感"
    }
];

for (let i = 0; i < noteNames.length; i++) {
    const root = noteNames[i];
    const nextRoot = noteNames[(i + 5) % 12];
    const nextMinor = noteNames[(i + 5) % 12] + "m";

    for (const type of chordTypes) {
        const name = root + type.suffix;

        chordDatabase[name] = {
            function: type.func,
            next: nextRoot + " / " + nextMinor,
            mood: type.mood
        };
    }
}

// よく使うコードの情報を上書き
Object.assign(chordDatabase, {
    "C": {
        function: "トニック",
        next: "F / G / Am",
        mood: "安定・明るい・落ち着き"
    },
    "Cm": {
        function: "トニック（マイナー）",
        next: "Fm / G / Ab",
        mood: "暗い・切ない・哀愁"
    },
    "C7": {
        function: "ドミナント",
        next: "F / Fm",
        mood: "緊張感・解決したくなる"
    },
    "Cm7": {
        function: "トニック / サブドミナント",
        next: "Fm / Bb7",
        mood: "柔らかい・切ない・落ち着き"
    },
    "Cmaj7": {
        function: "トニック",
        next: "F / Am / Dm",
        mood: "おしゃれ・穏やか"
    },
    "D": {
        function: "トニック系",
        next: "G / A / Bm",
        mood: "明るい・力強い"
    },
    "Dm": {
        function: "トニック系",
        next: "Gm / F / A",
        mood: "切ない・落ち着き"
    },
    "D7": {
        function: "ドミナント",
        next: "G / Gm",
        mood: "緊張感・ブルージー"
    },
    "E": {
        function: "トニック系",
        next: "A / B / C#m",
        mood: "明るい・力強い"
    },
    "Em": {
        function: "トニック系",
        next: "Am / C / D",
        mood: "切ない・落ち着き"
    },
    "E7": {
        function: "ドミナント",
        next: "A / Am",
        mood: "緊張感・ブルージー"
    },
    "F": {
        function: "サブドミナント",
        next: "G / C / Dm",
        mood: "温かい・安定"
    },
    "Fm": {
        function: "トニック系",
        next: "Bbm / C / Ab",
        mood: "暗い・切ない"
    },
    "F7": {
        function: "ドミナント",
        next: "Bb / Bbm",
        mood: "緊張感・ブルージー"
    },
    "G": {
        function: "ドミナント",
        next: "C / Em / Am",
        mood: "明るい・前向き"
    },
    "Gm": {
        function: "トニック系",
        next: "Cm / Eb / F",
        mood: "暗い・落ち着き"
    },
    "G7": {
        function: "ドミナント",
        next: "C / Cm",
        mood: "強い緊張感"
    },
    "Am": {
        function: "トニック（マイナー）",
        next: "Dm / F / G",
        mood: "切ない・自然"
    },
    "A7": {
        function: "ドミナント",
        next: "D / Dm",
        mood: "緊張感・ブルージー"
    },
    "B": {
        function: "トニック系",
        next: "E / F# / G#m",
        mood: "明るい・力強い"
    },
    "Bm": {
        function: "トニック系",
        next: "Em / G / A",
        mood: "切ない・落ち着き"
    },
    "B7": {
        function: "ドミナント",
        next: "E / Em",
        mood: "緊張感・ブルージー"
    }
});

// C/E、C/G、C/D などの分数コード
chordDatabase["C/E"] = {
    function: "トニック（第一転回形）",
    next: "F / G / Am",
    mood: "明るい・滑らか"
};

chordDatabase["C/G"] = {
    function: "トニック（第二転回形）",
    next: "F / G / Am",
    mood: "安定・広がり"
};

chordDatabase["C/D"] = {
    function: "分数コード / 付加音",
    next: "G / Dm / C",
    mood: "浮遊感・緊張感"
};

let currentKey = "C-major";

const keySelect = document.getElementById("key-select");

if (keySelect) {
    keySelect.addEventListener("change", () => {
        currentKey = keySelect.value;

        if (typeof updateChordDisplay === "function") {
            updateChordDisplay();
        }
    });
}
const keyFunctions = {

    "C-major": {
        "C": "I（トニック）",
        "Dm": "ii（サブドミナント）",
        "Em": "iii（トニック系）",
        "F": "IV（サブドミナント）",
        "G": "V（ドミナント）",
        "Am": "vi（トニック系）",
        "Bdim": "vii°（ドミナント系）"
    },

    "G-major": {
        "G": "I（トニック）",
        "Am": "ii（サブドミナント）",
        "Bm": "iii（トニック系）",
        "C": "IV（サブドミナント）",
        "D": "V（ドミナント）",
        "Em": "vi（トニック系）",
        "F#dim": "vii°（ドミナント系）"
    },

    "D-major": {
        "D": "I（トニック）",
        "Em": "ii（サブドミナント）",
        "F#m": "iii（トニック系）",
        "G": "IV（サブドミナント）",
        "A": "V（ドミナント）",
        "Bm": "vi（トニック系）",
        "C#dim": "vii°（ドミナント系）"
    },

    "A-major": {
        "A": "I（トニック）",
        "Bm": "ii（サブドミナント）",
        "C#m": "iii（トニック系）",
        "D": "IV（サブドミナント）",
        "E": "V（ドミナント）",
        "F#m": "vi（トニック系）",
        "G#dim": "vii°（ドミナント系）"
    },

    "E-major": {
        "E": "I（トニック）",
        "F#m": "ii（サブドミナント）",
        "G#m": "iii（トニック系）",
        "A": "IV（サブドミナント）",
        "B": "V（ドミナント）",
        "C#m": "vi（トニック系）",
        "D#dim": "vii°（ドミナント系）"
    },

    "B-major": {
        "B": "I（トニック）",
        "C#m": "ii（サブドミナント）",
        "D#m": "iii（トニック系）",
        "E": "IV（サブドミナント）",
        "F#": "V（ドミナント）",
        "G#m": "vi（トニック系）",
        "A#dim": "vii°（ドミナント系）"
    },

    "F-major": {
        "F": "I（トニック）",
        "Gm": "ii（サブドミナント）",
        "Am": "iii（トニック系）",
        "Bb": "IV（サブドミナント）",
        "C": "V（ドミナント）",
        "Dm": "vi（トニック系）",
        "Edim": "vii°（ドミナント系）"
    },

    "A-minor": {
        "Am": "i（トニック）",
        "Bdim": "ii°（サブドミナント系）",
        "C": "III（トニック系）",
        "Dm": "iv（サブドミナント）",
        "Em": "v（ドミナント系）",
        "F": "VI（サブドミナント系）",
        "G": "VII（ドミナント系）"
    },

    "E-minor": {
        "Em": "i（トニック）",
        "F#dim": "ii°（サブドミナント系）",
        "G": "III（トニック系）",
        "Am": "iv（サブドミナント）",
        "Bm": "v（ドミナント系）",
        "C": "VI（サブドミナント系）",
        "D": "VII（ドミナント系）"
    },

    "B-minor": {
        "Bm": "i（トニック）",
        "C#dim": "ii°（サブドミナント系）",
        "D": "III（トニック系）",
        "Em": "iv（サブドミナント）",
        "F#m": "v（ドミナント系）",
        "G": "VI（サブドミナント系）",
        "A": "VII（ドミナント系）"
    },

    "D-minor": {
        "Dm": "i（トニック）",
        "Edim": "ii°（サブドミナント系）",
        "F": "III（トニック系）",
        "Gm": "iv（サブドミナント）",
        "Am": "v（ドミナント系）",
        "Bb": "VI（サブドミナント系）",
        "C": "VII（ドミナント系）"
    },

    "G-minor": {
        "Gm": "i（トニック）",
        "Adim": "ii°（サブドミナント系）",
        "Bb": "III（トニック系）",
        "Cm": "iv（サブドミナント）",
        "Dm": "v（ドミナント系）",
        "Eb": "VI（サブドミナント系）",
        "F": "VII（ドミナント系）"
    },

    "C-minor": {
        "Cm": "i（トニック）",
        "Ddim": "ii°（サブドミナント系）",
        "Eb": "III（トニック系）",
        "Fm": "iv（サブドミナント）",
        "Gm": "v（ドミナント系）",
        "Ab": "VI（サブドミナント系）",
        "Bb": "VII（ドミナント系）"
    }
};
// 12種類の長調の音階
const majorKeyNotes = {
    "C-major":  ["C", "D", "E", "F", "G", "A", "B"],
    "C#-major": ["C#", "D#", "F", "F#", "G#", "A#", "C"],
    "D-major":  ["D", "E", "F#", "G", "A", "B", "C#"],
    "D#-major": ["D#", "F", "G", "G#", "A#", "C", "D"],
    "E-major":  ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "F-major":  ["F", "G", "A", "Bb", "C", "D", "E"],
    "F#-major": ["F#", "G#", "A#", "B", "C#", "D#", "F"],
    "G-major":  ["G", "A", "B", "C", "D", "E", "F#"],
    "G#-major": ["G#", "A#", "C", "C#", "D#", "F", "G"],
    "A-major":  ["A", "B", "C#", "D", "E", "F#", "G#"],
    "A#-major": ["A#", "C", "D", "D#", "F", "G", "A"],
    "B-major":  ["B", "C#", "D#", "E", "F#", "G#", "A#"]
};

// 各音階のコードの役割を自動生成
const majorRomanNumerals = [
    "I（トニック）",
    "ii（サブドミナント）",
    "iii（トニック系）",
    "IV（サブドミナント）",
    "V（ドミナント）",
    "vi（トニック系）",
    "vii°（ドミナント系）"
];

const majorChordQualities = [
    "",
    "m",
    "m",
    "",
    "",
    "m",
    "dim"
];

for (const [key, notes] of Object.entries(majorKeyNotes)) {
    if (!keyFunctions[key]) {
        keyFunctions[key] = {};
    }

    notes.forEach((note, index) => {
        const chordName = note + majorChordQualities[index];

        keyFunctions[key][chordName] =
            majorRomanNumerals[index];
    });
}

const keyNextChords = {

    "C-major": {
        "C": "F / G / Am",
        "Dm": "G / Am / C",
        "Em": "Am / C / F",
        "F": "G / C / Dm",
        "G": "C / Em / Am",
        "Am": "Dm / F / G"
    },

    "G-major": {
        "G": "C / D / Em",
        "Am": "D / Em / G",
        "Bm": "Em / G / A",
        "C": "D / G / Am",
        "D": "G / Bm / Em",
        "Em": "Am / C / D"
    },

    "D-major": {
        "D": "G / A / Bm",
        "Em": "A / Bm / D",
        "F#m": "Bm / D / E",
        "G": "A / D / Em",
        "A": "D / F#m / Bm",
        "Bm": "Em / G / A"
    },

    "A-major": {
        "A": "D / E / F#m",
        "Bm": "E / F#m / A",
        "C#m": "F#m / A / B",
        "D": "E / A / Bm",
        "E": "A / C#m / F#m",
        "F#m": "Bm / D / E"
    },

    "E-major": {
        "E": "A / B / C#m",
        "F#m": "B / C#m / E",
        "G#m": "C#m / E / F#",
        "A": "B / E / F#m",
        "B": "E / G#m / C#m",
        "C#m": "F#m / A / B"
    },

    "B-major": {
        "B": "E / F# / G#m",
        "C#m": "F# / G#m / B",
        "D#m": "G#m / B / C#",
        "E": "F# / B / C#m",
        "F#": "B / D#m / G#m",
        "G#m": "C#m / E / F#"
    },

    "F-major": {
        "F": "Bb / C / Dm",
        "Gm": "C / Dm / F",
        "Am": "Dm / F / G",
        "Bb": "C / F / Gm",
        "C": "F / Am / Dm",
        "Dm": "Gm / Bb / C"
    },

    "A-minor": {
        "Am": "Dm / F / G",
        "Bdim": "Dm / Em",
        "C": "F / G / Am",
        "Dm": "G / Am / C",
        "Em": "Am / C / Dm",
        "F": "G / Am / Dm",
        "G": "Am / C / Dm"
    },

    "E-minor": {
        "Em": "Am / C / D",
        "F#dim": "Am / Bm",
        "G": "C / D / Em",
        "Am": "D / Em / G",
        "Bm": "Em / G / Am",
        "C": "D / Em / Am",
        "D": "Em / G / Am"
    },

    "B-minor": {
        "Bm": "Em / G / A",
        "C#dim": "Em / F#m",
        "D": "G / A / Bm",
        "Em": "A / Bm / D",
        "F#m": "Bm / D / Em",
        "G": "A / Bm / Em",
        "A": "Bm / D / Em"
    },

    "D-minor": {
        "Dm": "Gm / Bb / C",
        "Edim": "Gm / Am",
        "F": "Bb / C / Dm",
        "Gm": "C / Dm / F",
        "Am": "Dm / F / Gm",
        "Bb": "C / Dm / F",
        "C": "Dm / F / Gm"
    },

    "G-minor": {
        "Gm": "Cm / Eb / F",
        "Adim": "Cm / Dm",
        "Bb": "Eb / F / Gm",
        "Cm": "F / Gm / Bb",
        "Dm": "Gm / Bb / Cm",
        "Eb": "F / Gm / Bb",
        "F": "Gm / Bb / Cm"
    },

    "C-minor": {
        "Cm": "Fm / Ab / Bb",
        "Ddim": "Fm / Gm",
        "Eb": "Ab / Bb / Cm",
        "Fm": "Bb / Cm / Eb",
        "Gm": "Cm / Eb / Fm",
        "Ab": "Bb / Cm / Eb",
        "Bb": "Cm / Eb / Fm"
    }
};