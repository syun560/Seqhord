import React, { useCallback, memo } from 'react'
import { Chord } from '@/types'

type Props = {
    tickLength: number
    chords: Chord[]
}

let a = 8 // 拍子

const chords_name = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F']

const chord_color = (chord: string):number => {
    let index = 0
    chords_name.forEach((ch, i) => {
        const found = chord.indexOf(ch)
        if (found !== -1) index = i * (360/chords_name.length)
    })
    return index
}

const tdStyle = (tick: number, chord:string, found:string|undefined) => {
    let res = {
        borderBottom: '1px solid black',
        borderLeft: '',
        background: `hsl(${chord_color(chord)},55%,35%)`,
        width: '20px',
        position: 'sticky' as const,
        zIndex: found ? 2 : 1,
        top: 20
    }
    if (tick % a === 0) res = { ...res, borderLeft: '1px solid black' }
    return res
}

export const ChordDisplay = memo(function ChordDisplay({tickLength, chords}: Props)  {

    // 対応するコードを探す
    const searchChord = useCallback((tick: number) => {
        const found = chords.find(c => c.tick === tick)?.chord_name
        return found ? ` ${found}` : found
    },[chords])

    // console.log("chordy!!")

    let foundChord = ""

    const cells = [...Array(tickLength)].map((_, tick)=>{
        const found = searchChord(tick)
        if (found !== undefined) foundChord = found

        return <td key={tick} style={tdStyle(tick, foundChord, found)}>
            {found}
        </td>
    })


    return <tr>
        <th style={tdStyle(1, "", undefined)}></th>
        {cells}
    </tr>
})