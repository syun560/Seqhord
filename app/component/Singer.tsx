import React, { memo, useState, useRef, useEffect } from 'react'
import { Track, VoiceVox, WebAudio } from 'types'
import { Button, Select } from '@fluentui/react-components'

interface SingerProps {
    vox: VoiceVox
    tracks: Track[]
    bpm: number
    audio: WebAudio
}

export const Singer = memo(function Singer({ vox, tracks, bpm, audio }: SingerProps) {

    // console.log("singer rendered!!")
    const sampleRef = useRef<HTMLAudioElement>(null)

    const VoiceSynth = async () => {
        try {
            await vox.synthVoice(tracks[0].notes, bpm)
        }
        catch (err) {
            console.error("VoiceSynth Error:", err)
        }
    }

    // セレクトタグの内容を作る
    let items = null
    items = vox.singers_info.map(singer =>
        <option key={singer.speaker_uuid} value={singer.styles[0].id}>
            {singer.name}
        </option>
    )

    const sampleVoice = () => {
        const audio = sampleRef.current
        if (!audio) return
        audio.paused ? audio.play() : audio.pause()
    }

    const onChangeSinger = async (id: number) => {
        console.log("set singer: ", id)
        vox.setSinger(id)

        const found = vox.singers_info.find(singer => singer.styles[0].id === id)
        const speaker_uuid = found?.speaker_uuid
        console.log("speaker_uuid:", speaker_uuid)

        try {
            const url = `http://localhost:50021/singer_info?speaker_uuid=${speaker_uuid}&resource_format=url`
            const res = await fetch(url)
            const json = await res.json()
            vox.setSingersPortrait(json.portrait)
            console.log(json)
        }
        catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        vox.setSingersPortrait("http://localhost:50021/_resources/8496e5617ad4d9a3f6a9e6647a91fe90f966243f35d775e8e213e8d9355d5030")
    }, [])
    useEffect(() => {
        if (vox.audioData) audio.setURL(URL.createObjectURL(vox.audioData))
    }, [vox.audioData])

    return <>

        {items.length === 0 ?
            <></>
            :
            <div>
                <Select className="d-inline ms-2" onChange={(e) => onChangeSinger(Number(e.target.value))} value={vox.singer}>
                    {items}
                </Select>

                {vox.creating ?
                    <Button disabledFocusable={true}>
                        Creating...
                    </Button>
                    :
                    <Button onClick={VoiceSynth}>
                        Synth
                    </Button>
                }
            </div>
        }

        <div>
            {/* {vox.audioData && synthState &&
                <>
                <button onClick={playAudio}>再生</button>
                <button onClick={stopAudio}>停止</button>
                </>
            } */}

            {/* {sample && sample !== "" && <audio src={sample} ref={sampleRef} />} */}
        </div>
    </>
})