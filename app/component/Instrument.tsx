import React  from 'react'
import { MIDI } from '@/types'

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
        else {
            out_items = [<option key={-1} value={-1}>- No MIDI outputs</option>]
        }
    }else {
        out_items = [<option key={-1} value={-1}>- No MIDI outputs</option>]
    }

    return <div className='me-2'>
        {/* <tr><td>Input: </td><td><select>{ in_items }</select></td></tr> */}
        <select className="form-select d-inline" onChange={(e)=>midi.changePorts(e.target.value)} defaultValue="-1">
            { out_items }
        </select>
    </div>
}