const chordDatabase = {

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
        next: "Dm7 / F / Am7",
        mood: "明るい・透明感・おしゃれ"
    },

    "D": {
        function: "ドミナント系",
        next: "G / Gm",
        mood: "明るい・前へ進む感じ"
    },

    "Dm": {
        function: "サブドミナント",
        next: "G / Am / C",
        mood: "穏やか・少し切ない"
    },

    "D7": {
        function: "ドミナント",
        next: "G / Gm",
        mood: "強い緊張感・解決への期待"
    },

    "Dm7": {
        function: "サブドミナント",
        next: "G7 / Cmaj7",
        mood: "柔らかい・落ち着き・都会的"
    },

    "E": {
        function: "ドミナント系",
        next: "A / Am",
        mood: "明るい・強い・前進"
    },

    "Em": {
        function: "トニック系",
        next: "Am / C / D",
        mood: "切ない・穏やか・内向的"
    },

    "E7": {
        function: "ドミナント",
        next: "A / Am",
        mood: "強い緊張感・ブルージー"
    },

    "Em7": {
        function: "トニック系",
        next: "Am7 / Cmaj7 / D7",
        mood: "柔らかい・浮遊感"
    },

    "F": {
        function: "サブドミナント",
        next: "G / C / Dm",
        mood: "安定・温かい・広がり"
    },

    "Fm": {
        function: "サブドミナント（借用）",
        next: "C / Ab / Eb",
        mood: "切ない・ドラマチック"
    },

    "F7": {
        function: "ドミナント",
        next: "Bb / Bbmaj7",
        mood: "強い・ブルージー・緊張感"
    },

    "Fmaj7": {
        function: "サブドミナント",
        next: "G / Am / C",
        mood: "柔らかい・温かい・おしゃれ"
    },

    "G": {
        function: "ドミナント",
        next: "C / Em / Am",
        mood: "明るい・前進・解決への期待"
    },

    "Gm": {
        function: "トニック系 / サブドミナント系",
        next: "Cm / Eb / F",
        mood: "暗い・落ち着き・哀愁"
    },

    "G7": {
        function: "ドミナント",
        next: "C / Cm",
        mood: "強い緊張感・解決感"
    },

    "Gmaj7": {
        function: "トニック",
        next: "Am7 / C / D",
        mood: "明るい・透明感・穏やか"
    },

    "Am": {
        function: "トニック系",
        next: "Dm / F / G / C",
        mood: "切ない・穏やか・親しみやすい"
    },

    "Am7": {
        function: "トニック系",
        next: "Dm7 / Fmaj7 / G7",
        mood: "柔らかい・浮遊感・おしゃれ"
    },

    "A7": {
        function: "ドミナント",
        next: "Dm / D",
        mood: "強い・ブルージー・緊張感"
    },

    "B": {
        function: "ドミナント系",
        next: "E / Em",
        mood: "明るい・力強い"
    },

    "Bm": {
        function: "トニック系",
        next: "Em / G / A",
        mood: "切ない・内向的・落ち着き"
    },

    "B7": {
        function: "ドミナント",
        next: "E / Em",
        mood: "強い緊張感・ブルージー"
    },

    "Bm7": {
        function: "トニック系",
        next: "Em7 / Gmaj7 / A7",
        mood: "柔らかい・落ち着き・浮遊感"
    }
        ,

      "C6": {
        function: "トニック系",
        next: "F / G / Am",
        mood: "明るい・柔らかい・穏やか"
    },
    "C#6": {
        function: "トニック系",
        next: "F# / G# / A#m",
        mood: "明るい・柔らかい・穏やか"
    },
    "D6": {
        function: "トニック系",
        next: "G / A / Bm",
        mood: "明るい・柔らかい・穏やか"
    },
    "D#6": {
        function: "トニック系",
        next: "G# / A# / Cm",
        mood: "明るい・柔らかい・穏やか"
    },
    "E6": {
        function: "トニック系",
        next: "A / B / C#m",
        mood: "明るい・柔らかい・穏やか"
    },
    "F6": {
        function: "トニック系",
        next: "Bb / C / Dm",
        mood: "明るい・柔らかい・穏やか"
    },
    "F#6": {
        function: "トニック系",
        next: "B / C# / D#m",
        mood: "明るい・柔らかい・穏やか"
    },
    "G6": {
        function: "トニック系",
        next: "C / D / Em",
        mood: "明るい・柔らかい・穏やか"
    },
    "G#6": {
        function: "トニック系",
        next: "C# / D# / Fm",
        mood: "明るい・柔らかい・穏やか"
    },
    "A6": {
        function: "トニック系",
        next: "D / E / F#m",
        mood: "明るい・柔らかい・穏やか"
    },
    "A#6": {
        function: "トニック系",
        next: "D# / F / Gm",
        mood: "明るい・柔らかい・穏やか"
    },
    "B6": {
        function: "トニック系",
        next: "E / F# / G#m",
        mood: "明るい・柔らかい・穏やか"
    },

    "Cm6": {
        function: "トニック系",
        next: "Fm / G / Ab",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "C#m6": {
        function: "トニック系",
        next: "F#m / G# / A",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "Dm6": {
        function: "トニック系",
        next: "Gm / A / Bb",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "D#m6": {
        function: "トニック系",
        next: "G#m / A# / B",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "Em6": {
        function: "トニック系",
        next: "Am / B / C",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "Fm6": {
        function: "トニック系",
        next: "Bbm / C / Db",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "F#m6": {
        function: "トニック系",
        next: "Bm / C# / D",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "Gm6": {
        function: "トニック系",
        next: "Cm / D / Eb",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "G#m6": {
        function: "トニック系",
        next: "C#m / D# / E",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "Am6": {
        function: "トニック系",
        next: "Dm / E / F",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "A#m6": {
        function: "トニック系",
        next: "D#m / F / F#",
        mood: "切ない・ジャズっぽい・落ち着き"
    },
    "Bm6": {
        function: "トニック系",
        next: "Em / F# / G",
        mood: "切ない・ジャズっぽい・落ち着き"
    },

    "Cadd9": {
        function: "トニック系",
        next: "F / G / Am",
        mood: "明るい・広がり・透明感"
    },
    "C#add9": {
        function: "トニック系",
        next: "F# / G# / A#m",
        mood: "明るい・広がり・透明感"
    },
    "Dadd9": {
        function: "トニック系",
        next: "G / A / Bm",
        mood: "明るい・広がり・透明感"
    },
    "D#add9": {
        function: "トニック系",
        next: "G# / A# / Cm",
        mood: "明るい・広がり・透明感"
    },
    "Eadd9": {
        function: "トニック系",
        next: "A / B / C#m",
        mood: "明るい・広がり・透明感"
    },
    "Fadd9": {
        function: "トニック系",
        next: "Bb / C / Dm",
        mood: "明るい・広がり・透明感"
    },
    "F#add9": {
        function: "トニック系",
        next: "B / C# / D#m",
        mood: "明るい・広がり・透明感"
    },
    "Gadd9": {
        function: "トニック系",
        next: "C / D / Em",
        mood: "明るい・広がり・透明感"
    },
    "G#add9": {
        function: "トニック系",
        next: "C# / D# / Fm",
        mood: "明るい・広がり・透明感"
    },
    "Aadd9": {
        function: "トニック系",
        next: "D / E / F#m",
        mood: "明るい・広がり・透明感"
    },
    "A#add9": {
        function: "トニック系",
        next: "D# / F / Gm",
        mood: "明るい・広がり・透明感"
    },
    "Badd9": {
        function: "トニック系",
        next: "E / F# / G#m",
        mood: "明るい・広がり・透明感"
    },

    "Cmadd9": {
        function: "トニック系",
        next: "Fm / G / Ab",
        mood: "切ない・浮遊感・広がり"
    },
    "C#madd9": {
        function: "トニック系",
        next: "F#m / G# / A",
        mood: "切ない・浮遊感・広がり"
    },
    "Dmadd9": {
        function: "トニック系",
        next: "Gm / A / Bb",
        mood: "切ない・浮遊感・広がり"
    },
    "D#madd9": {
        function: "トニック系",
        next: "G#m / A# / B",
        mood: "切ない・浮遊感・広がり"
    },
    "Emadd9": {
        function: "トニック系",
        next: "Am / B / C",
        mood: "切ない・浮遊感・広がり"
    },
    "Fmadd9": {
        function: "トニック系",
        next: "Bbm / C / Db",
        mood: "切ない・浮遊感・広がり"
    },
    "F#madd9": {
        function: "トニック系",
        next: "Bm / C# / D",
        mood: "切ない・浮遊感・広がり"
    },
    "Gmadd9": {
        function: "トニック系",
        next: "Cm / D / Eb",
        mood: "切ない・浮遊感・広がり"
    },
    "G#madd9": {
        function: "トニック系",
        next: "C#m / D# / E",
        mood: "切ない・浮遊感・広がり"
    },
    "Amadd9": {
        function: "トニック系",
        next: "Dm / E / F",
        mood: "切ない・浮遊感・広がり"
    },
    "A#madd9": {
        function: "トニック系",
        next: "D#m / F / F#",
        mood: "切ない・浮遊感・広がり"
    },
    "Bmadd9": {
        function: "トニック系",
        next: "Em / F# / G",
        mood: "切ない・浮遊感・広がり"
    },

    "Csus2": {
        function: "トニック系",
        next: "F / G / Am",
        mood: "開放的・爽やか・浮遊感"
    },

    "Csus4": {
        function: "トニック系",
        next: "C / G / F",
        mood: "緊張感・解決感・広がり"
    },

    "Cdim": {
        function: "経過コード",
        next: "C# / D / Eb",
        mood: "不安定・緊張感・不穏"
    },

    "Caug": {
        function: "トニック系",
        next: "F / Am / Ab",
        mood: "浮遊感・不思議・不安定"
    }
        ,

    "Cm7♭5": {
        function: "サブドミナント系",
        next: "Fm / G7",
        mood: "暗い・不安定・緊張感"
    }
    ,

"C/E": {
    function: "トニック",
    next: "F / G / Am",
    mood: "明るい・安定・ベースが上昇する感じ"
},

"C/G": {
    function: "トニック",
    next: "F / G / Am",
    mood: "安定・力強い・広がり"
},

"C/D": {
    function: "ドミナント系",
    next: "G / G7",
    mood: "浮遊感・緊張感・次へ進む感じ"
}
};
let currentKey = "C-major";

const keySelect = document.getElementById("key-select");

keySelect.addEventListener("change", () => {
    currentKey = keySelect.value;

    console.log("現在のキー:", currentKey);

    if (typeof updateChordDisplay === "function") {
        updateChordDisplay();
    }
});

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
    }
};
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
        "Am": "D / Em / C",
        "Bm": "Em / G / D",
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
        "G#m": "C#m / E / A",
        "A": "B / E / F#m",
        "B": "E / G#m / C#m",
        "C#m": "F#m / A / B"
    },

    "B-major": {
        "B": "E / F# / G#m",
        "C#m": "F# / G#m / B",
        "D#m": "G#m / B / E",
        "E": "F# / B / C#m",
        "F#": "B / D#m / G#m",
        "G#m": "C#m / E / F#"
    },

    "F-major": {
        "F": "Bb / C / Dm",
        "Gm": "C / Dm / F",
        "Am": "Dm / F / Gm",
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
        "F": "G / Am / C",
        "G": "Am / C / Dm"
    },

    "E-minor": {
        "Em": "Am / C / D",
        "F#dim": "Am / Bm",
        "G": "C / D / Em",
        "Am": "D / Em / G",
        "Bm": "Em / G / Am",
        "C": "D / Em / G",
        "D": "Em / G / Am"
    },

    "B-minor": {
        "Bm": "Em / G / A",
        "C#dim": "Em / F#m",
        "D": "G / A / Bm",
        "Em": "A / Bm / D",
        "F#m": "Bm / D / Em",
        "G": "A / Bm / D",
        "A": "Bm / D / Em"
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