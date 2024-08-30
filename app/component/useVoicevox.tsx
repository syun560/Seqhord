import { create } from 'domain'
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

    // covert notes for VoiceVox
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
        let tick = 0

        notes.forEach((note, i)=>{
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

            if (note.lyric){
                lyric = note.lyric[0]
                if (note.lyric.length > 1){
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

    const synthVoice = async (notes: Note[]) => {
        const voiceNotes = convertNotes(notes)
        inputmusic.notes = voiceNotes
        console.log(inputmusic)

        const res = await superagent
            .post('http://localhost:50021/sing_frame_audio_query')
            .query({ speaker: 6000 })
            .send(inputmusic)

        if (!res) return

        const res2 = await superagent
            .post('http://localhost:50021/frame_synthesis')
            .query({ speaker: 3001 })
            .send(res.body)
            .responseType('blob')

        if (!res2) return
        setAudioData(res2.body as Blob)
    }

    return {audioData, queryJson, createQuery, createVoice, synthVoice}
}