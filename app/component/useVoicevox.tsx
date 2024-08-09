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
    const [queryJson, setQueryJson] = useState<Query>()
    const [audioData, setAudioData] = useState<Blob>()

    // 文字列からQueryを作り出す
    const createQuery = async () => {
        const res = await superagent
            .post('http://localhost:50021/audio_query')
            .query({ speaker: 1, text: inputText })

        if (!res) return

        setQueryJson(res.body as Query)
    }

    // Queryから合成音声を作り出す
    const createVoice = async () => {
        const res = await superagent
            .post('http://localhost:50021/synthesis')
            .query({ speaker: 1 })
            .send(queryJson)
            .responseType('blob')

        if (!res) return

        setAudioData(res.body as Blob)
    }

    return {audioData, queryJson, createQuery, createVoice}
}