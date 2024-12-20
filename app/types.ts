import Soundfont from 'soundfont-player';
import  { Dispatch, SetStateAction } from "react"

export type MenuFunc = {
    onNew: () => void
    saveMIDI: () => void
    saveMusicXML: () => void
    saveText: () => void
    saveAsJson: () => void
    showOpenFileDialog: () => Promise<unknown>
    showMIDIFileDialog: () => Promise<unknown>
    onCompile: () => void
    autoCompose: () => void
}

export type SingerInfo = {
    name: string
    speaker_uuid: string
    styles: [
        {
            name: string
            id: number
            type: string
        }
    ]
    version: string
    supported_features: {
        permitted_synthesis_morphing: string
    }
}

// Query型定義
type Mora = {
    text: string
    consonant: string
    consonant_length: number
    vowel: string
    vowel_length: number
    pitch: number
}

export type Query = {
    accent_phrases: {
        moras: Mora[]
        accent: number
        pause_mora: Mora
    }
    speedScale: number
    pitchScale: number
    intonationScale: number
    volumeScale: number
    prePhonemeLength: number
    postPhonemeLength: number
    outputSamplingRate: number
    outputStereo: boolean
    kana: string
}

export type VoiceVox = {
    audioData: Blob | undefined
    queryJson: Query | undefined
    synthVoice: (notes: Note[], bpm:number)=>void
    creating: boolean
    singer: number
    setSinger: Dispatch<SetStateAction<number>>
    singers_info: SingerInfo[]
    getSingers: ()=>void,
    singers_portrait: string
    setSingersPortrait: Dispatch<SetStateAction<string>>
}

export type Note = {
    pitch: number   // 0~128
    pitch_name: string // C4, D3 ...
    duration: number // 1
    channel: number // 0
    velocity: number // 1~100
    tick: number // 
    lyric?: string 
}

export type Chord = {
    tick: number

    chord_name: string
    pitch: number
    third: 'omit' | 'minor' | 'major'
    
    seventh?: 'minor' | 'major'
    ninth?: 'omit' | 'minor'
    eleventh?: 'omit' | 'minor' 
    on: number // 0~11
}

export type Track = {
    name: string
    ch: number
    type: string
    trans: number
    notes: Note[]
    texts: string
    program: number // プログラムナンバー(1～128)
    volume: number
    panpot: number
}

export type Scale = {
    tick: number
    scale: string
}

export type hyoushi = {
    tick: number // 始まりからの絶対的なtick
    mea: number 
    reso?: number // 分解能
}

export type Var2 = {
    name :string
    notes: Note[]
    len: number
}

export type MIDI = {
    setup: ()=>void
    noteOn: (pitch :number, ch:number, duration: number)=>void
    programChange: (program: number, ch:number)=>void
    volume: (val: number, ch:number)=>void
    allNoteOff: ()=>void
    outPorts: any
    changePorts: (port: string)=>void
}

export type Sound = {
    isLoading: Soundfont.Player|null
    setup: ()=>void
    playNote: (midiNumber: string)=>void
    stopNote: (midiNumber: string)=>void
    stopAllNotes: ()=>void
}

export type Sequencer = {
    play: ()=>void
    stop: ()=>void
    first: ()=>void
    nextMea: ()=>void
    playToggle: ()=>void
    setNowTick: Dispatch<SetStateAction<number>>
    setMIDI: Dispatch<SetStateAction<MIDI>>
    nowTick: number
    isPlaying: boolean
}



// コンパイル結果
export type Res = {
    tracks: Track[]
    title: string
    bpm: number
    tick: number
    scales: Scale[]
    vars: Var2[]
    chords: Chord[]
    errMsg: string
}