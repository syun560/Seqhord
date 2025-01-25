import React from 'react'
import Lib from 'Lib'

interface Props {
    selected: boolean
    note: number
    tick: number
    lyric: string
    duration: number
}

// ノートの幅(px)
const width = 20
const height = 20

// Cメジャー・スケール
const c_major = [0,2,4,5,7,9,11]

export default function PianoRollCell(props: Props) {
    
    // スタイルを追加
    let td = { 
        width: `${width}px`,
        height: `${height}px`,
        padding: '0px',
        background: Lib.colorNormalNote,
        borderBottom: '0px black solid',
        borderLeft: '',
        overflow: 'visible',
        fontSize: '1em',
    }
    let pianodiv: {[key: string]: string}= {
        background: 'black',
        position: 'relative',
        color: '#1e5782',
        fontWeight: 'bold',
        // right: '-50px',
        height: `${height}px`,
        width: `${width * props.duration + 2 }px`,
        margin: '-1px',
        lineHeight: '1.3',
        padding: '0 0 0 0.15em',
        border: '1px #555 solid',
    }

    // アボイドノートは色を変える
    if (!c_major.includes(props.note % 12)) {
        td = { ...td, background: Lib.colorAvoidNote}
    }

    // ノートに色を付ける
    if (props.selected) pianodiv = { ...pianodiv, background: Lib.colorNote }   // Noteの色
    if (props.note % 12 === 0) td = {...td, borderBottom: '1px solid #DDD'}     // オクターブごとの線

    // tick4つごとに区切り線を追加
    // 拍子はa/bで表される
    let a = 4

    if (props.tick % 2 === 0) td = { ...td, borderLeft: '1px solid #999999' } // 1拍ごとの線
    if (props.tick % (a * 2) === 0) td = { ...td, borderLeft: '1px solid #DDD' } // 1小節ごとの線

    // console.log("pianocell")

    return <td style={td}>
        {!props.selected ? <></> :
        <div style={pianodiv} className='shadow-lg'>
            <span>{props.lyric}</span>
        </div>
        }
    </td>
}