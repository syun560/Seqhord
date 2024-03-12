import { Note } from './types.ts'

class Lib {
    // ノートナンバー（64）をノート（C5）に変換する
    static noteNumberToNoteName(num :number) {
        const notes_name = ['C','C#','D','D#','E','F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const base = Math.floor(num / 12) - 1
        const offset = num % 12
        return notes_name[offset] + base.toString()
    }

    // ノートの最小値と最大値を求める
    static getMinMaxNote(notes: Note[]): [number, number] {
    // 一番下のノート（下端のノート）
    const sorted = [...notes].sort((a,b) => a.pitch > b.pitch ? 1 : -1)
    let minNote = 0
    let maxNote = 127
    if (notes.length > 0) {
        minNote = sorted[0].pitch
        maxNote = sorted[notes.length - 1].pitch
    }
    return [minNote, maxNote]
}


    static programName = [
        "Piano 1",
        "Piano 2",
        "Piano 3",
        "Honkey-tonk",
        "E.Piano 1",
        "E.Piano 2",
        "Harpsichord",
        "Clav.",
        "Celesta",
        "Glockenspiel",
        "Music Box",
        "Vibraphone",
        "Marimba",
        "Xylophone",
        "Tubular Bells",
        "Dulcrimer",
        "Organ 1",
        "Organ 2",
        "Organ 3",
        "Pipe Organ",
        "Reed Organ",
        "Accordion",
        "Harmonica",
        "Bandneon",
        "Nylon-str.Guitar",
        "Steel-str.Gt",
        "Jazz Guitar",
        "Clean Guitar",
        "Muted Guitar",
        "Overdrive Guitar",
        "Distortion Guitar",
        "Gt.Harmonics",
        "Acoustic Bass",
        "Fingered Bass",
        "Picked Bass",
        "Fretless Bass",
        "Slap Bass 1",
        "Slap Bass 2",
        "Synth Bass 1",
        "Synth Bass 2",
        "Violin",
        "Viola",
        "Cello",
        "Contrabass",
        "Tremolo Strings",
        "Pizzicato Strings",
        "Harp",
        "Timpani",
        "Strings",
        "Slow Strings",
        "Synth Strings 1",
        "Synth Strings 2",
        "Chor Aahs",
        "Voice Oohs",
        "Synth Vox",
        "OrchestraHit",
        "Trumpet",
        "Trombone",
        "Tuba",
        "MutedTrumpet",
        "French Horns",
        "Brass 1",
        "Synth Brass 1",
        "Synth Brass 2",
        "Soprano Sax",
        "Alto Sax",
        "Tenor Sax",
        "Baritone Sax",
        "Oboe",
        "English Horn",
        "Bassoon",
        "Clarinet",
        "Piccolo",
        "Flute",
        "Recorder",
        "Pan Flute",
        "Bottle Blow",
        "Shakuhachi",
        "Whistle",
        "Ocarina",
        "Square Wave",
        "Saw Wave",
        "Synth Calliope",
        "Chiffer Lead",
        "Charang",
        "Solo Vox",
        "5th Saw Wave",
        "Bass & Lead",
        "Fantasia",
        "Warm Pad",
        "Polysynth",
        "Space Voice",
        "Bowed Glass",
        "Metal Pad",
        "Halo Pad",
        "Sweep Pad",
        "Ice Rain",
        "SoundTrack",
        "Crystal",
        "Atomosphere",
        "Brightness",
        "Goblin",
        "Echo Drops",
        "Star Theme",
        "Sitar",
        "Banjo",
        "Shamisen",
        "Koto",
        "Kalimba",
        "Bagpipe",
        "Fiddle",
        "Shenai",
        "Tinkle Bell",
        "Agogo",
        "Steel Drums",
        "Woodblock",
        "Taiko",
        "Melodic Tom",
        "Synth Drum",
        "Reverse Sym",
        "Gt.FretNoise",
        "Breath Noise",
        "Seashore",
        "Bird",
        "Telephone",
        "Helicopter",
        "Applause",
        "Gun Shot",
    ]
}


export default Lib