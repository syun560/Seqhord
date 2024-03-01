// コンパイル結果
export type Res = {
    title: string
    bpm: number
    scale: string
    errMsg: string
    mea: number
    notes: Note[][]
    chords: Chord[],
    vars: Var[]
}

export type Note = {
    pitch: number   // 0~128
    pitch_name: string // C4, D3 ...
    duration: number // 1
    channel: number // 0
    velocity: number // 1~100
    mea?: number // 
    tick: number // 
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

export type Var = {
    tick: number

    name: string
    repeat: number
}