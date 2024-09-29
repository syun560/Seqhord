import React  from 'react'
import { useState } from 'react'
import { Track_Info } from 'types'

type SingerInfo = {
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

interface Props {
    vox: any
    tracks: Track_Info[]
    bpm: number
}

export const Singer = ({vox, tracks, bpm} :Props) => {

    const [singers_info, setSingersInfo] = useState<SingerInfo[]>([])
    
    // get singers from VoiceVox API
    const getSingers = async () => {
        try {
            const res = await fetch("http://localhost:50021/singers")
            const json = await res.json() as SingerInfo[]
            // console.log(json)
            setSingersInfo(json)
        }
        catch(err) {
            console.error(err)
        }
    }

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
    items = singers_info.map(singer =>
        <option key={singer.speaker_uuid} value={singer.styles[0].id}>
            {singer.name}
        </option>
    )
    // if (midi.outPorts !== undefined){
    //     if(midi.outPorts.length > 0) {
    //         out_items = midi.outPorts.map((value:any) =>
    //         <option key={n++} value={value.ID}>{value.name} ({value.ID})</option> 
    //         )
    //     }
    // }

    const onChangeSinger = async (id: number) => {
        console.log("set singer: ",id)
        vox.setSinger(id)

        const found = singers_info.find(singer=>singer.styles[0].id === id)
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

    return <span className='mx-2'>
    {items.length === 0 ? 
        <button type="button" className="btn btn-dark" onClick={getSingers}>useVoiceVox</button>
        :
        <>
        <select onChange={(e)=>onChangeSinger(Number(e.target.value))} value={vox.singer}>
            { items }
        </select>
        
        {vox.creating ?
            <button type="button" className="btn btn-secondary" onClick={vox.VoiceSynth}>
            Creating...
            </button>
        :
        <button type="button" className="btn btn-dark" onClick={VoiceSynth}>
            Voice Synth
        </button>
        }
        </>
    }
    </span>
}