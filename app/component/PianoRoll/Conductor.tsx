import React, { useRef, createRef, useEffect, useMemo, useCallback } from 'react'
import { Sequencer, Chord } from '@/types'

type Props = {
    tickLength: number
    seq: Sequencer
    chords: Chord[]
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

export const Conductor = ({tickLength, seq, chords}: Props) => {

    // 自動スクロールするためにtickLengthぶんのrefを作成
    const refs = useRef<React.RefObject<HTMLTableCellElement>[]>([])
    
    useEffect(()=>{
        console.log("うんち")
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

    // 対応するコードを探す
    const searchChord = useCallback((tick: number) => {
        const found = chords.find(c => c.tick === tick)?.chord_name
        return found ? ` [${found}]` : found
    },[chords])

    const cells = [...Array(tickLength)].map((_, tick)=><td 
        key={tick}
        style={tdStyle(tick)}
        ref={refs.current[tick]}
        className={Math.floor(seq.nowTick) === tick ? 'bg-info' : ''}
        onClick={()=>seq.setNowTick(tick)}>

        {tick % a === 0 && tick / a}
        {searchChord(tick)}
        
    </td>)


    return <tr>
        <th style={tdStyle(1)}></th>
        {cells}
    </tr>
}