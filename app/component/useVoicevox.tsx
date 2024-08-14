import React, { ChangeEvent, useState } from 'react'
import superagent from 'superagent'

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

export const useVoiceVox = () => {

    const inputText = "こんにちは、ずんだもんなのだ。"
    const inputmusic = {
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

    // 文字列からQueryを作り出す
    const createQuery = async () => {
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