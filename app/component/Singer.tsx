import React, { memo } from 'react'
import { Track, VoiceVox } from 'types'
import { Button, Select } from '@fluentui/react-components'
import zundamon from "/public/images/zzm_zunmon027.png"

interface SingerProps {
    vox: VoiceVox
    tracks: Track[]
    bpm: number
}

export const Singer = memo(function singer({vox, tracks, bpm} :SingerProps)  {

    console.log("singer rendered!!")

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

    const onChangeSinger = async (id: number) => {
        console.log("set singer: ",id)
        vox.setSinger(id)

        const found = vox.singers_info.find(singer=>singer.styles[0].id === id)
        const speaker_uuid = found?.speaker_uuid
        console.log("speaker_uuid:", speaker_uuid)

        try {
            const url = `http://localhost:50021/singer_info?speaker_uuid=${speaker_uuid}&resource_format=url`
            const res = await fetch(url)
            const json = await res.json()
            vox.setSingersPortrait(json.portrait)
        }
        catch(err) {
            console.error(err)
        }
    }

    return <>
    {vox.audioData &&
        <audio
        controls
        src={vox.audioData ? window.URL.createObjectURL(vox.audioData) : undefined}>
        </audio>
    }

    <img height="88%" src={vox.singers_portrait === "" ? zundamon.src : vox.singers_portrait} alt="singer"/>

    {items.length === 0 ? 
        <></>
        :
        <>
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
        </>
    }
    </>
})