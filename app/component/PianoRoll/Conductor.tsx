import React, { useRef, createRef, useEffect, useCallback } from 'react'
import { Sequencer } from '@/types'

type Props = {
    tickLength: number
    seq: Sequencer
    pianoBar: HTMLDivElement|null
}

let a = 8 // 拍子

const tdStyle = (tick: number) => {
    let res = {
        borderBottom: '1px solid black',
        borderLeft: '',
        width: '20px',
        position: 'sticky' as const,
        top: 0
    }
    if (tick % a === 0) res = { ...res, borderLeft: '1px solid black' }
    return res
}

export const Conductor = ({tickLength, seq, pianoBar }: Props) => {

    // scroll to current tick
    useEffect(()=> {
        if(pianoBar) {
            const bar_left = pianoBar.scrollLeft
            const bar_width = pianoBar.scrollWidth
            const tick_ratio = seq.nowTick / tickLength
            const tick_pos = tick_ratio * bar_width
            const gap = tick_pos - bar_left
            const behavior = (gap > 800 || gap < -400) ? 'instant' : 'smooth'
            if (gap > 400 || gap < 0){

                pianoBar.scroll({
                    top: 0,
                    left: tick_pos - 50,
                    behavior,
                })
            }
        }
        // scrollToCenter(seq.nowTick + 10)
    }, [seq.nowTick, seq.isPlaying])


    const cells = [...Array(tickLength)].map((_, tick)=><td 
        key={tick}
        style={tdStyle(tick)}
        className={Math.floor(seq.nowTick) === tick ? 'bg-info' : ''}
        onClick={()=>seq.setNowTick(tick)}>

        {tick % a === 0 && tick / a}
        
    </td>)


    return <tr>
        <th style={tdStyle(1)}></th>
        {cells}
    </tr>
}