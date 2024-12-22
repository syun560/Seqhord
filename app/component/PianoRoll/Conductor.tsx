import React, { useRef, createRef, useEffect, useCallback } from 'react'
import { Sequencer } from '@/types'

type Props = {
    tickLength: number
    seq: Sequencer
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

export const Conductor = ({tickLength, seq }: Props) => {

    // 自動スクロールするためにtickLengthぶんのrefを作成
    const refs = useRef<React.RefObject<HTMLTableCellElement>[]>([])
    
    useEffect(()=>{
        for (let i = 0; i < tickLength; i++) {
            refs.current[i] = (createRef<HTMLTableCellElement>())
        }
    }, [tickLength])

    const scrollToCenter = useCallback ((i: number) => {
        if (i < tickLength)
            refs.current[i].current?.scrollIntoView({
                behavior: 'smooth',
                // behavior: 'auto',
                block: 'center',
                inline: 'center',
        })
    },[tickLength])

    // scroll to current tick
    useEffect(()=> {
         if (seq.nowTick % 20 === 0 ) scrollToCenter(seq.nowTick + 10)
    }, [seq.nowTick, seq.isPlaying])


    const cells = [...Array(tickLength)].map((_, tick)=><td 
        key={tick}
        style={tdStyle(tick)}
        ref={refs.current[tick]}
        className={Math.floor(seq.nowTick) === tick ? 'bg-info' : ''}
        onClick={()=>seq.setNowTick(tick)}>

        {tick % a === 0 && tick / a}
        
    </td>)


    return <tr>
        <th style={tdStyle(1)}></th>
        {cells}
    </tr>
}