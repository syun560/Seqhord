import React  from 'react'
import { useState } from 'react'

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

export const Singer = () => {

    const [singers_info, setSingersInfo] = useState<SingerInfo[]>([])

    // get singers from VoiceVox API
    const getSingers = async () => {
        try {
            const res = await fetch("http://localhost:50021/singers")
            const json = await res.json()
            // console.log(json)
            setSingersInfo(json)
        }
        catch(err) {
            console.error(err)
        }
    }


    // セレクトタグの内容を作る
    let items = null
    items = singers_info.map(singer =>
        <option key={singer.speaker_uuid} value={singer.speaker_uuid}>
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

    return <span className='me-2'>
        <button type="button" className="btn btn-dark" onClick={getSingers}>useVoiceVox</button>
        <select onChange={(e)=>(e.target.value)} defaultValue="-1">
            { items }
        </select>
    </span>
}