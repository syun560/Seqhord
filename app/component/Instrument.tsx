import React  from 'react'
import { MIDI } from '@/types'
import { Select } from '@fluentui/react-components'

interface Props {
    midi: MIDI
}

export const Instrument = (props: Props) => {

    const midi = props.midi

    // セレクトタグの内容を作る
    let n = 0
    let out_items = []
    if (midi.outPorts !== undefined){
        if(midi.outPorts.length > 0) {
            out_items = midi.outPorts.map((value:any) =>
            <option key={n++} value={value.ID}>{value.name}</option> 
            )
        }
    }

    return <span className='me-2'>
        {/* <tr><td>Input: </td><td><select>{ in_items }</select></td></tr> */}
        <Select className="d-inline" onChange={(e)=>midi.changePorts(e.target.value)} defaultValue="-1">
            { out_items }
        </Select>
    </span>
}