import React, { useState } from 'react'
import superagent from 'superagent'
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
    key: null|number
    frame_length: number
    lyric: string
}

export const useVoiceVox = () => {

    const inputText = "こんにちは、ずんだもんなのだ。"
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

    // notesを変換する
    const convertNotes = (notes: Note[]):VoiceNote[] => {
        const reso = 1
        const default_frame_length = 15
        let tick_max = notes.length > 0 ? notes[notes.length - 1].tick + notes[notes.length - 1].duration : 0
        const ticks:number[] = []
        for (let i = 0; i <= tick_max; i++) ticks.push(i)
        const voiceNotes:VoiceNote[] = []
        voiceNotes.push({ key: null, frame_length: 15, lyric: "" })


        let pitch = null
        let frame_length = 0
        let lyric = ""
        ticks.forEach(tick=>{
            const found = notes.find((n)=>n.tick === tick * reso)
            if (found) {
                pitch = found.pitch
                frame_length = default_frame_length * found.duration
                lyric = found.lyric![0]
                voiceNotes.push({
                    key: pitch,
                    frame_length: frame_length,
                    lyric: lyric
                })
            }
        })
        voiceNotes.push({ key: null, frame_length: 15, lyric: "" })

        return voiceNotes
    }

    // 文字列からQueryを作り出す
    const createQuery = async (notes: Note[]) => {
        const voiceNotes = convertNotes(notes)
        inputmusic.notes = voiceNotes
        console.log(inputmusic)

        const res = await superagent
            .post('http://localhost:50021/sing_frame_audio_query')
            .query({ speaker: 6000 })
            .send(inputmusic)

        if (!res) return

        setQueryJson(res.body as Query)
    }

    // Queryから合成音声を作り出す
    const createVoice = async () => {
        const res = await superagent
            .post('http://localhost:50021/frame_synthesis')
            .query({ speaker: 3001 })
            .send(queryJson)
            .responseType('blob')

        if (!res) return
        setAudioData(res.body as Blob)
    }

    return {audioData, queryJson, createQuery, createVoice}
}