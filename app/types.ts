export type Note = {
    pitch: number   // 0~128
    pitch_name: string // C4, D3 ...
    duration: number // 1
    channel: number // 0
    velocity: number // 1~100
    mea: number // 
    tick: number // 
    lyric?: string 
}

export type Chord = {
    mea?: number
    tick: number

    chord_name: string
    pitch: number
    third: 'omit' | 'minor' | 'major'
    
    seventh?: 'minor' | 'major'
    ninth?: 'omit' | 'minor'
    eleventh?: 'omit' | 'minor' 
    on: number // 0~11
}

export type Track_Info = {
    name: string
    ch: number
    type: 'conductor' |'chord' | 'bass' | 'drum'
    notes: Note[]
    texts: string
}

export type Scale = {
    mea?: number
    tick: number
    scale: string
}

export type Var = {
    tick: number

    name: string
    repeat: number
}

// コンパイル結果
export type Res = {
    title: string
    bpm: number
    scales: Scale[]
    errMsg: string
    mea: number
    tracks: Track_Info[]
    chords: Chord[]
    vars: Var[]
}