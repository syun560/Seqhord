import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Note, SingerInfo, Query, VoiceVox } from 'types'

type VoiceNote = {
    key: null | number
    frame_length: number
    lyric: string
}

// covert notes for VoiceVox
const convertNotes = (notes: Note[], bpm: number): VoiceNote[] => {
    const frame_rate = 93.75
    
    const quarter = 60 / bpm / 2 // 実現したい8分音符の長さ（秒）
    const frame = 1 / frame_rate // VOICEVOXの1フレーム当たりの長さ（秒）

    // let default_frame_length = Math.floor(quarter / frame)
    // if (default_frame_length % 2 !== 0) default_frame_length += 1 
    let default_frame_length = quarter / frame
    // console.log(default_frame_length)

    let tick_max = notes.length > 0 ? notes[notes.length - 1].tick + notes[notes.length - 1].duration : 0
    const ticks: number[] = []
    for (let i = 0; i <= tick_max; i++) ticks.push(i)
    const voiceNotes: VoiceNote[] = []
    voiceNotes.push({ key: null, frame_length: 16, lyric: "" })


    let pitch = null
    let frame_length = 0
    let lyric = ""

    // roundによるズレの補正
    let round_shift = 0

    notes.forEach((note, i) => {

        // ズレの補正
        const dur = default_frame_length * note.duration
        round_shift += dur - Math.round(dur)
        if (-1 < round_shift && round_shift < 1) {
            frame_length = Math.round(dur)
        }else {
            frame_length = Math.round(dur) + Math.round(round_shift)
            round_shift = round_shift - Math.round(round_shift)
        }

        pitch = note.pitch

        if (i > 0) {
            const prevnote = notes[i - 1]
            const difftick = note.tick - prevnote.tick
            // 休符の挿入
            if (difftick > prevnote.duration) {

                // ズレの補正
                let rest_length = 0
                const dur = default_frame_length * (difftick - prevnote.duration)
                round_shift += dur - Math.round(dur)
                if (-1 < round_shift && round_shift < 1) {
                    rest_length = Math.round(dur)
                }else {
                    rest_length = Math.round(dur) + Math.round(round_shift)
                    round_shift = round_shift - Math.round(round_shift)
                }

                voiceNotes.push({
                    key: null,
                    frame_length: rest_length,
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
            frame_length,
            lyric
        })
    })

    voiceNotes.push({ key: null, frame_length: 15, lyric: "" })

    return voiceNotes
}

const inputmusic = {
    notes: [
        { key: null, frame_length: 15, lyric: "" },
        { key: 60, frame_length: 45, lyric: "ド" },
        { key: 62, frame_length: 45, lyric: "レ" },
        { key: 64, frame_length: 45, lyric: "ミ" },
        { key: null, frame_length: 15, lyric: "" }
    ]
}

export const useVoiceVox = ():VoiceVox => {
    const [queryJson, ] = useState<Query>()
    const [audioData, setAudioData] = useState<Blob>()

    const [singer, setSingerState] = useState(3001)
    const voice = useRef(3001)
    
    const [singers_portrait, setSingersPortrait] = useState<string>("http://localhost:50021/_resources/8496e5617ad4d9a3f6a9e6647a91fe90f966243f35d775e8e213e8d9355d5030")
    const [creating, setCreating] = useState(false)
    const [singers_info, setSingersInfo] = useState<SingerInfo[]>([])

    // get singers from VoiceVox API
    const getSingers = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:50021/singers")
            const json = await res.json() as SingerInfo[]
            // console.log(json)
            setSingersInfo(json)
        }
        catch(err) {
            console.error(err)
        }
    },[])

    const synthVoice = useCallback(async (notes: Note[], bpm:number):Promise<string> => {
        const voiceNotes = convertNotes(notes, bpm)
        inputmusic.notes = voiceNotes

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
            const url2 = `http://localhost:50021/frame_synthesis?speaker=${voice.current}`
            const audio = await fetch(url2, params2)
            const blob = await audio.blob()
            setAudioData(blob)
            setCreating(false)
            return "Synthesis complete!"
        }
        catch (err) {
            console.error("Synthesis Error:", err)
            setCreating(false)
            return "Synthesis Error"
        }
    },[])

    useEffect(()=>{
        getSingers()
    },[])

    const setSinger = useCallback((val: number) => {
        setSingerState(val)
        voice.current = val
    },[])

    return useMemo (()=>({ 
        audioData, queryJson, 
        synthVoice, 
        creating,
        singer, setSinger,
        singers_info, getSingers,
        singers_portrait, setSingersPortrait
    }),[audioData, queryJson, creating, singer, singers_info, singers_portrait])
}