import React, { useState } from 'react'
import { Note } from 'types'

// Query型定義
type Mora = {
    text: string
    consonant: string
    consonant_length: number
    vowel: string
    vowel_length: number
    pitch: number
}

type Query = {
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

type VoiceNote = {
    key: null | number
    frame_length: number
    lyric: string
}

export const useVoiceVox = () => {

    let inputmusic = {
        notes: [
            { key: null, frame_length: 15, lyric: "" },
            { key: 60, frame_length: 45, lyric: "ド" },
            { key: 62, frame_length: 45, lyric: "レ" },
            { key: 64, frame_length: 45, lyric: "ミ" },
            { key: null, frame_length: 15, lyric: "" }
        ]
    }
    const [queryJson, setQueryJson] = useState<Query>()
    const [audioData, setAudioData] = useState<Blob>()
    const [singer, setSinger] = useState(3001)
    const [singers_portrait, setSingersPortrait] = useState<string>("")
    const [creating, setCreating] = useState(false)

    // covert notes for VoiceVox
    const convertNotes = (notes: Note[], bpm: number): VoiceNote[] => {
        const reso = 1
        const frame_rate = 93.75
        
        const quarter = 60 / bpm / 2 // 実現したい8分音符の長さ（秒）
        const frame = 1 / frame_rate // VOICEVOXの1フレーム当たりの長さ（秒）

        let default_frame_length = Math.floor(quarter / frame)
        if (default_frame_length % 2 !== 0) default_frame_length += 1 

        let tick_max = notes.length > 0 ? notes[notes.length - 1].tick + notes[notes.length - 1].duration : 0
        const ticks: number[] = []
        for (let i = 0; i <= tick_max; i++) ticks.push(i)
        const voiceNotes: VoiceNote[] = []
        voiceNotes.push({ key: null, frame_length: 16, lyric: "" })


        let pitch = null
        let frame_length = 0
        let lyric = ""

        notes.forEach((note, i) => {
            pitch = note.pitch
            frame_length = default_frame_length * note.duration
            pitch = note.pitch

            if (i > 0) {
                const prevnote = notes[i - 1]
                const difftick = note.tick - prevnote.tick
                if (difftick > prevnote.duration) {
                    voiceNotes.push({
                        key: null,
                        frame_length: default_frame_length * (difftick - prevnote.duration),
                        lyric: ""
                    })
                }
            }

            if (note.lyric) {
                lyric = note.lyric[0]
                if (note.lyric.length > 1) {
                    if (note.lyric[1] === "ゃ" || note.lyric[1] === "ゅ" || note.lyric[1] === "ょ" || note.lyric[1] === "ャ" || note.lyric[1] === "ュ" || note.lyric[1] === "ョ") {
                        lyric += note.lyric[1]
                    }
                }
            }
            else lyric = ""

            voiceNotes.push({
                key: pitch,
                frame_length: frame_length,
                lyric: lyric
            })
        })

        voiceNotes.push({ key: null, frame_length: 15, lyric: "" })

        return voiceNotes
    }

    const synthVoice = async (notes: Note[], bpm:number) => {
        const voiceNotes = convertNotes(notes, bpm)
        inputmusic.notes = voiceNotes
        console.log(inputmusic)

        try {
            const url = "http://localhost:50021/sing_frame_audio_query?speaker=6000"
            setCreating(true)
            const params = { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(inputmusic)
            }
            const res = await fetch(url, params)
            const query = await res.json()
            // console.log(query)
            
            const params2 = {
                method: "POST",
                headers: {"Content-Type": 'application/json'},
                body: JSON.stringify(query),
            }
            const url2 = `http://localhost:50021/frame_synthesis?speaker=${singer}`
            const audio = await fetch(url2, params2)
            const blob = await audio.blob()
            setAudioData(blob)
            setCreating(false)
        }
        catch (err) {
            console.error("Synthesis Error:", err)
            setCreating(false)
            return
        }
    }

    return { 
        audioData, 
        queryJson, 
        synthVoice, 
        creating,
        singer, setSinger, 
        singers_portrait, setSingersPortrait }
}