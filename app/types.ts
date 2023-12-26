export type Note = {
    pitch: number
    pitch_name: string
    duration: number
    channel: number
    velocity: number
    tick: number
}

export type Chord = {
    pitch: number
    chord_name: string
    tick: number
}