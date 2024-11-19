import React from 'react'
import Lib from 'Lib'

interface Props {
    selected: boolean
    note: number
    tick: number
    lyric: string
    duration: number
}

export default function PianoRollCell(props: Props) {
    // ノートの幅(px)
    const width = 20
    const height = 20

    // スタイルを追加
    let td = { 
        width: `${width}px`,
        height: `${height}px`,
        padding: '0px',
        background: Lib.colorNormalNote,
        borderBottom: '0px black solid',
        borderLeft: '',
        overflow: 'visible',
        fontSize: '0.8em',
    }
    let pianodiv: {[key: string]: string}= {
        background: 'black',
        position: 'relative',
        // right: '-50px',
        height: `${height}px`,
        width: `${width * props.duration + 2 }px`,
        margin: '-1px',
        padding: '0px',
        border: '1px #555 solid',
    }

    // Cメジャー・スケール
    const c_major = [0,2,4,5,7,9,11]

    // アボイドノートは色を変える
    if (!c_major.includes(props.note % 12)) {
        td = { ...td, background: Lib.colorAvoidNote}
    }

    // ノートに色を付ける
    if (props.selected) pianodiv = { ...pianodiv, background: Lib.colorNote }                     // Noteの色
    if (props.note % 12 === 0) td = {...td, borderBottom: '1px solid #DDD'}     // オクターブごとの線

    // tick4つごとに区切り線を追加
    // 拍子はa/bで表される
    let a = 4

    if (props.tick % 2 === 0) td = { ...td, borderLeft: '1px solid #999999' }    // 1拍ごとの線
    if (props.tick % (a * 2) === 0) td = { ...td, borderLeft: '1px solid #DDD' } // 1小節ごとの線

    return <td style={td}>
        {!props.selected ? <></> :
        <div style={pianodiv} className='shadow-lg'>
            <span className='text-primary'>{props.lyric}</span>
        </div>
        }
    </td>
}