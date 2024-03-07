import React from 'react'


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
        background: 'lightgray',
        borderBottom: '0px lightgray solid',
        borderLeft: '',
        overflow: 'visible',
        fontSize: '0.8em',
    }
    let pianodiv = {
        background: 'lightgray',
        position: 'relative',
        // right: '-50px',
        height: `${height}px`,
        width: `${width * props.duration + 2 }px`,
        margin: '-1px',
        padding: '0px',
        border: '1px gray solid',
    }

    // Cメジャー・スケール
    const c_major = [0,2,4,5,7,9,11]

    // アボイドノートは色を変える
    if (!c_major.includes(props.note % 12)) {
        td = { ...td, background: 'aliceblue'}
    }

    // ノートに色を付ける
    if (props.selected) pianodiv = { ...pianodiv, background: 'skyblue' }                     // Noteの色
    if (props.note % 12 === 0) td = {...td, borderBottom: '1px black solid'}     // オクターブごとの線

    // tick4つごとに区切り線を追加
    // 拍子はa/bで表される
    let a = 4
    let b = 4

    if (props.tick % 2 === 0) td = { ...td, borderLeft: '1px solid #e7e7e7' }    // 1拍ごとの線
    if (props.tick % (a * 2) === 0) td = { ...td, borderLeft: '1px solid #111' } // 1小節ごとの線

    return <td style={td}>
        {!props.selected ? <></> :
        <div style={pianodiv} className='shadow'>
            <span className='text-primary'>{props.lyric}</span>
        </div>
        }
    </td>
}