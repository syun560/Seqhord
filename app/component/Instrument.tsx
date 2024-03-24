import React  from 'react'

export const Instrument = (midi: any) => {

    const test = ()=>{
        midi.noteOn(60)
    }

    // セレクトタグの内容を作る
    let n = 0
    let out_items = []
    if (midi.outPorts !== undefined){
        if(midi.outPorts.length > 0) {
            out_items = midi.outPorts.map((value:any) =>
            <option key={n++} value={value.ID}>{value.name} ({value.ID})</option> 
            )
        }
    }

    return <span className='me-2'>
        {/* <tr><td>Input: </td><td><select>{ in_items }</select></td></tr> */}
        MidiOut: <select onChange={(e)=>midi.setSelectedOutPortID(e.target.value)} defaultValue="-1">
            { out_items }
        </select>
        <button onClick={test}>テスト</button>
    </span>
}