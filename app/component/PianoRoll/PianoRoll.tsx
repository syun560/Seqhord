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

// あらかじめ作っておく
const pre_roll = () => {

}

export const PianoRoll: React.FC<PianoRollProps> = ({ tracks, nowTrack, seq, chords, pianoBar }) => {

    // tickの最大値
    let tick_max = 32
    tracks.forEach(track=>{
        if (track.notes.length > 1) {
            const et = track.notes[track.notes.length - 1].tick + track.notes[track.notes.length - 1].duration
            if(et > tick_max) tick_max = et
        }
    })
    tick_max = Math.floor(tick_max)


    // ダミーの数値（Reactのkeyのため）
    const pitchs: number[] = []
    for (let i = 127; i >= 0; i--) pitchs.push(i)
    const ticks: number[] = []
    for (let i = 0; i <= tick_max; i++) ticks.push(i)

    // ピアノロール生成
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const rolls = useMemo(()=>{
        console.log("roll") 
        return tracks.map(t => {
            
            return pitchs.map((fuga, indexRow) => {        
            const pitch = 127 - indexRow
            // 最小値と最大値
            const [minNote, maxNote] = Lib.getMinMaxNote(t.notes)
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
                        const found = t.notes.find((n) => n.pitch === pitch && n.tick === tick * reso)
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
        })
    })}, [tracks[0].last_compiled])


    return <div>
        <table className="pianotable">
            <thead>
                <Conductor tickLength={tick_max} seq={seq} pianoBar={pianoBar} />
                <ChordDisplay tickLength={tick_max} chords={chords}/>
            </thead>
            <tbody onClick={seq.playToggle}>
                {rolls[nowTrack]}
            </tbody>
        </table>
    </div>
}