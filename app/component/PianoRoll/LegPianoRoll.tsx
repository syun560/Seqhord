import React from 'react'
import { useMemo } from "react"
import { Note, Sequencer } from 'types'
import Lib from 'Lib'

import { Conductor } from './Conductor.tsx'
import PianoRollCell from './PianoRollCell.tsx'

export const LegPianoRoll: React.FC<{ notes: Note[]; seq: Sequencer }> = ({ notes, seq }) => {
    const th = {
        padding: '0px',
        borderRight: '1px black solid',
        position: 'sticky' as const,
        background: 'grey',
        left: 0
    }
    const th_base = {
        ...th,
        borderBottom: '1px black solid',
        background: 'grey'
    }
    const note_name_style = {
        fontSize: '0.8em',
    }

    // 最小値と最大値
    const [minNote, maxNote] = useMemo(()=>Lib.getMinMaxNote(notes),[notes])
    // const [minNote, maxNote] = [0, 128]

    // 分解能（できれば外からpropsで読み込みたい）
    const reso = 1

    // tickの最大値
    let tick_max = notes.length > 0 ? notes[notes.length - 1].tick + notes[notes.length - 1].duration : 0

    // ダミーの数値（Reactのkeyのため必要？）
    const pitchs: number[] = []
    for (let i = 127; i >= 0; i--) pitchs.push(i)
    const ticks: number[] = []
    for (let i = 0; i <= tick_max; i++) ticks.push(i)

    // ピアノロールに表示するデータの設定
    // const cleanData = (n: Note, pitch: number, tick: number): boolean => {
    //     return n.pitch === pitch && n.tick === tick * reso
    // }

    // アボイドノートで色を変える
    const st = (note: number) => {
        let res = th
        const c_major = [0, 2, 4, 5, 7, 9, 11]
        if (!c_major.includes(note % 12)) {
            res = { ...res, background: 'lightgray' }
        }
        return res
    }


    // ピアノロール生成
    const roll = useMemo(() => pitchs.map((fuga, indexRow) => {
        const pitch = 127 - indexRow
        if (pitch < minNote || pitch > maxNote) return
        else return (
            <tr key={fuga}>
                {/* 音階 */}
                <th style={pitch % 12 ? st(pitch) : th_base}>
                    <div style={note_name_style}>
                        {pitch % 12 === 0 || pitch === minNote || pitch === maxNote ? Lib.noteNumberToNoteName(pitch) : ''}
                    </div>
                </th>

                {ticks.map((tick, indexCol) => {
                    const found = notes.find((n) => n.pitch === pitch && n.tick === tick * reso)
                    const selected = found === undefined ? false : true
                    const lyric = found === undefined ? '' : found.lyric
                    const duration = found === undefined ? 1 : found.duration
                    return <PianoRollCell
                        key={tick} note={pitch} tick={tick}
                        selected={selected}
                        lyric={lyric === undefined ? '' : lyric}
                        duration={duration}
                    />
                })}
            </tr>
        )
    }),[notes])
    
    return <div>
        <table className="pianotable">
            <tbody>
                <Conductor tickLength={tick_max} seq={seq} />
                {roll}
            </tbody>
        </table>
    </div>
}