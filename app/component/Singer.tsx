import React, { memo, useState, useRef, useEffect } from 'react'
import { Track, VoiceVox } from 'types'
import { Button, Select } from '@fluentui/react-components'
import zundamon from "/public/images/zzm_zunmon027.png"

interface SingerProps {
    vox: VoiceVox
    tracks: Track[]
    bpm: number
}

export const Singer = memo(function Singer({vox, tracks, bpm} :SingerProps)  {

    // console.log("singer rendered!!")
    const [sample, setSample] = useState<string>("")
    const [synthState, setSynthState] = useState<boolean>(false)

    const sampleRef = useRef<HTMLAudioElement>(null)

    const VoiceSynth = async () => {
        try {
            await vox.synthVoice(tracks[0].notes, bpm)
            setSynthState(true)
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
        console.log("set singer: ",id)
        vox.setSinger(id)

        const found = vox.singers_info.find(singer=>singer.styles[0].id === id)
        const speaker_uuid = found?.speaker_uuid
        console.log("speaker_uuid:", speaker_uuid)
        setSynthState(false)

        try {
            const url = `http://localhost:50021/singer_info?speaker_uuid=${speaker_uuid}&resource_format=url`
            const res = await fetch(url)
            const json = await res.json()
            vox.setSingersPortrait(json.portrait)
            console.log(json)
            setSample(json.style_infos[0].voice_samples[0])
        }
        catch(err) {
            console.error(err)
        }
    }

    useEffect(()=>{
        vox.setSingersPortrait("http://localhost:50021/_resources/8496e5617ad4d9a3f6a9e6647a91fe90f966243f35d775e8e213e8d9355d5030")
    },[vox.singers_info])

    console.log(sample)

    return <>

    {items.length === 0 ? 
        <></>
        :
        <div>
        <Select className="d-inline ms-2" onChange={(e)=>onChangeSinger(Number(e.target.value))} value={vox.singer}>
            { items }
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

    {vox.audioData && synthState &&
        <audio
        controls
        src={vox.audioData ? window.URL.createObjectURL(vox.audioData) : undefined}>
        </audio>
    }

    {sample && sample !== "" && <audio src={sample} ref={sampleRef}/>}
    </div>
    {vox.singers_portrait !== "" && items.length !== 0 &&
        <img onClick={sampleVoice} height="88%" src={vox.singers_portrait} alt="singer"/>
    }
    </>
})