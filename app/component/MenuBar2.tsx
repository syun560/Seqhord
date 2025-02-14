import React, { memo, Dispatch, SetStateAction } from "react"
import { Sequencer, Mark, Track, MIDI } from "@/types";
import Lib from "@/Lib";
import { RotaryKnob } from "./RotaryKnob";

// fluent ui
import {
    Button, Tooltip, ToolbarButton, ToolbarDivider,
} from "@fluentui/react-components"

import {
    bundleIcon,
    PlayRegular, PlayFilled, PauseRegular, PauseFilled,
    ChevronDoubleLeftFilled, ChevronDoubleLeftRegular, ChevronDoubleRightFilled, ChevronDoubleRightRegular,
    ChevronRightFilled, ChevronRightRegular, ChevronLeftFilled, ChevronLeftRegular,
} from "@fluentui/react-icons"

const PlayIcon = bundleIcon(PlayRegular, PlayFilled)
const PauseIcon = bundleIcon(PauseRegular, PauseFilled)
const RewindIcon = bundleIcon(ChevronDoubleLeftRegular, ChevronDoubleLeftFilled)
const LastIcon = bundleIcon(ChevronDoubleRightRegular, ChevronDoubleRightFilled)
const FastForwardIcon = bundleIcon(ChevronRightRegular, ChevronRightFilled)
const PrevIcon = bundleIcon(ChevronLeftRegular, ChevronLeftFilled)

type MenuBarPropsType = {
    tracks: Track[]
    midi: MIDI
    seq: Sequencer
    scale: string
    bpm: number
    marks: Mark[]
    nowTrack: number
    setTracks: Dispatch<SetStateAction<Track[]>>

    changeProgram: (program: number) => void
}

const programs = Lib.programName.map((p, i) => <option key={i} value={i}>{String(i).padStart(3, '0')}: {p}</option>)
const drums = Lib.drumName.map((p, i) => {
    if (p === "") return
    return <option key={i} value={i}>{String(i).padStart(3, '0')}: {p}</option>
})

export const MenuBar2 = memo(function MenuBar({ tracks, setTracks, midi, seq, bpm, scale, marks, nowTrack, changeProgram }: MenuBarPropsType) {

    // コンダクトバー
    const ConductBar = <div className="fs-6 d-none d-sm-block">
        <span className="me-2">
            Tick: <span style={{ fontFamily: "monospace" }}>
                {String(Math.floor(seq.nowTick / 8)).padStart(3, '\xa0')}:{String((seq.nowTick % 8).toFixed(1)).padStart(2, '0')}
            </span>
        </span>
        <span className="me-2">
            Beat: <span style={{ fontFamily: "monospace" }}>4/4</span>
        </span>
        <span className="me-2">
            Tempo: <span style={{ fontFamily: "monospace" }}>{bpm}</span>
        </span>
        <span>
            Key: <span style={{ fontFamily: "monospace" }}>{scale}</span>
        </span>
    </div>

    // OperationBar
    const SeqBar = <div>
        <Tooltip content="先頭へ" relationship="label" positioning="below-start">
            <Button size="large" appearance="transparent" onClick={seq.first} icon={<RewindIcon />} />
        </Tooltip>
        <Tooltip content="一小節前へ" relationship="label" positioning="below-start">
            <Button size="large" appearance="transparent" onClick={seq.prevMea} icon={<PrevIcon />} />
        </Tooltip>
        <Tooltip content={seq.isPlaying ? "一時停止" : "再生"} relationship="label" positioning="below-start">
            <Button className="mx-2" shape="circular" appearance="primary" onClick={seq.playToggle} size="large" icon={seq.isPlaying ? <PauseIcon /> : <PlayIcon />} />
        </Tooltip>
        <Tooltip content="一小節先へ" relationship="label" positioning="below-start">
            <Button size="large" appearance="transparent" onClick={seq.nextMea} icon={<FastForwardIcon />} />
        </Tooltip>
        <Tooltip content="最後尾へ" relationship="label" positioning="below-start">
            <Button size="large" appearance="transparent" onClick={seq.last} icon={<LastIcon />} />
        </Tooltip>
    </div>

    const MarkBar = <div className="d-none d-sm-block">

        {marks.map((mark, i) => {
            let isMark = false
            if (i < marks.length - 1) {
                if (mark.tick <= seq.nowTick && seq.nowTick < marks[i + 1].tick) isMark = true
            } else {
                if (mark.tick <= seq.nowTick) isMark = true
            }
            return <button
                className={"btn " + (isMark ? "btn-secondary" : "btn-dark")}
                key={mark.tick + mark.name}
                onClick={() => seq.setNowTick(mark.tick)}
            >
                {mark.name}
            </button>
        })}
    </div>
    
    // ミキサーのところと重複しているので一つにしたい
    const setVolume = (volume: number, ch: number) => {
        setTracks(tracks => tracks.map((track, i) => {
            if (i === ch) {
                const texts = track.texts.split('\n').map(line=>{
                    if (line.includes("@volume")) return `@volume = ${Math.floor(volume)}`
                    else return line
                }).join('\n')
                return { ...track, volume, texts }
            }
            else return track
        }))

        midi.setVolume(volume, tracks[ch].ch)
    }

    const instBar = <div className="d-flex">
        <div className="mx-2">
            <select className="form-select" value={tracks[nowTrack].program} onChange={(e) => changeProgram(Number(e.target.value))} >
                {tracks[nowTrack].type === "drum" ? drums : programs}
            </select>
        </div>
        <RotaryKnob value={tracks[nowTrack].volume} onChange={(val:number)=>setVolume(val, nowTrack)} min={0} max={127} />              
    </div>

    return <>
        {instBar}
        <ToolbarDivider className="py-2" />
        {ConductBar}
        <ToolbarDivider className="py-2" />
        {SeqBar}
        <ToolbarDivider className="py-2" />
        {MarkBar}
    </>
})