import React, { useRef, createRef, useEffect } from 'react'
import { Sequencer } from '@/types'

interface Props {
    tickLength: number
    seq: Sequencer
}

export const Conductor = (props: Props) => {

    // ピアノロールを最適な箇所に自動でスクロールする
    // refをtickLengthぶん作ってみる
    const refs = useRef<React.RefObject<HTMLTableCellElement>[]>([])
    for (let i = 0; i < props.tickLength; i++) {
        refs.current[i] = (createRef<HTMLTableCellElement>())
    }
    const scrollToCenter = (i: number) => {
        if (i < props.tickLength)
            refs.current[i].current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            })
    }
    const doClick = (tick: number) => {
        props.seq.setNowTick(tick)
    }
    
    // いい感じのところでスクロールする。
    useEffect(()=> {
         if (props.seq.nowTick % 20 === 0 ) scrollToCenter(props.seq.nowTick + 10)
    }, [props.seq.nowTick, props.seq.isPlaying])
    
    //let a = state.timeSignatures[0].timeSignature[0] * 2
    let a = 8 // 拍子
    if (a === 6) a *= 2
    const tdStyle = (tick: number) => {
        let res = {
            borderBottom: '1px solid black',
            borderLeft: '',
            width: '20px'
        }
        if (tick % a === 0) res = { ...res, borderLeft: '1px solid black' }
        return res
    }

    const cells = (()=> {
        const res: JSX.Element[] = []
        for (let tick = 0; tick <= props.tickLength; tick++) {
            res.push(
                <td key={tick} style={tdStyle(tick)} ref={refs.current[tick]}
                    className={props.seq.nowTick - 1 === tick ? 'bg-info' : ''}
                    onClick={()=>doClick(tick)} >
                    {tick % a === 0 ? 
                    tick / a
                    : ''}
                </td>
            )
        }
        return res
    })()

    return <tr>
        <th style={tdStyle(1)} className={props.seq.nowTick === 0 ? 'bg-info' : ''}></th>
        {cells}
    </tr>
}