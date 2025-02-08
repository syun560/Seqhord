import React from 'react'
import { useMemo } from "react"
import { Track, Sequencer, Chord } from 'types'
import Lib from 'Lib'

import { Conductor } from './Conductor.tsx'
import PianoRollCell from './PianoRollCell.tsx'
import { ChordDisplay } from './ChordDisplay.tsx'

const th = {
    padding: '0px',
    borderRight: '1px black solid',
    position: 'sticky' as const,
    background: Lib.colorPianoKey,
    left: 0
}
const th_base = {
    ...th,
    borderBottom: '1px black solid',
    background: Lib.colorPianoKey
}
const note_name_style = {
    fontSize: '0.8em',
}
// 分解能（できれば外からpropsで読み込みたい）
const reso = 1
// アボイドノートで色を変える
const st = (note: number) => {
    let res = th
    const c_major = [0, 2, 4, 5, 7, 9, 11]
    if (!c_major.includes(note % 12)) {
        res = { ...res, background: Lib.colorAvoidPianoKey }
    }
    return res
}

type PianoRollProps = {
    tracks: Track[]
    nowTrack: number
    seq: Sequencer
    chords: Chord[]
    pianoBar: HTMLDivElement|null
}

export const PianoRoll: React.FC<PianoRollProps> = ({ tracks, nowTrack: nowTrack, seq, chords, pianoBar }) => {
    const notes = tracks[nowTrack].notes

    // 最小値と最大値
    const [minNote, maxNote] = useMemo(()=>Lib.getMinMaxNote(notes),[notes])
    // const [minNote, maxNote] = [0, 128]

    // tickの最大値
    let tick_max = notes.length > 0 ? notes[notes.length - 1].tick + notes[notes.length - 1].duration : 0
    tick_max = Math.floor(tick_max)

    // ダミーの数値（Reactのkeyのため）
    const pitchs: number[] = []
    for (let i = 127; i >= 0; i--) pitchs.push(i)
    const ticks: number[] = []
    for (let i = 0; i <= tick_max; i++) ticks.push(i)

    // ピアノロールに表示するデータの設定
    // const cleanData = (n: Note, pitch: number, tick: number): boolean => {
    //     return n.pitch === pitch && n.tick === tick * reso
    // }

    // ピアノロール生成
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const roll = useMemo(() => pitchs.map((fuga, indexRow) => {        
        const pitch = 127 - indexRow
        // console.log("Pianoroll")
        if (pitch < minNote || pitch > maxNote) return
        else return (
            <tr key={fuga}>
                {/* 音階 */}
                <th style={pitch % 12 ? st(pitch) : th_base}>
                    <div style={note_name_style}>
                        {pitch % 12 === 0 || pitch === minNote || pitch === maxNote ? Lib.noteNumberToNoteName(pitch) : ''}
                    </div>
                </th>

                {ticks.map(tick => {
                    const found = notes.find((n) => n.pitch === pitch && n.tick === tick * reso)
                    const selected = found === undefined ? false : true
                    const lyric = found === undefined ? '' : found.lyric
                    const duration = found === undefined ? 1 : found.duration
                    
                    return <PianoRollCell
                        key={tick}
                        note={pitch}
                        tick={tick}
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
            <thead>
                <Conductor tickLength={tick_max} seq={seq} pianoBar={pianoBar} />
                <ChordDisplay tickLength={tick_max} chords={chords}/>
            </thead>
            <tbody onClick={seq.playToggle}>
                {roll}
            </tbody>
        </table>
    </div>
}