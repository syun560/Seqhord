import React, { memo } from "react"
import { Sequencer, Mark, Track } from "@/types";
import Lib from "@/Lib";

// fluent ui
import {
    Select, Button, Label, Tooltip, ToolbarButton, ToolbarDivider,
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
    seq: Sequencer
    scale: string
    bpm: number
    audioRef: React.RefObject<HTMLAudioElement>
    marks: Mark[]
    tabnum: number

    changeProgram: (program: number) => void
}

const programs = Lib.programName.map((p, i) => <option key={i} value={i}>{String(i).padStart(3, '0')}: {p}</option>)
const drums = Lib.drumName.map((p, i) => {
    if (p === "") return
    return <option key={i} value={i}>{String(i).padStart(3, '0')}: {p}</option>
})

export const MenuBar2 = memo(function MenuBar({ tracks, seq, bpm, audioRef, scale, marks, tabnum, changeProgram }: MenuBarPropsType) {

    const play2 = () => {
        seq.playToggle()
        const audio = audioRef.current
        if (!audio) return
        audio.paused ? audio.play() : audio.pause()
    }

    // コンダクトバー
    const ConductBar = <div className="p-1 d-none d-sm-block">
        <span className="me-2">
            Tick: <Label size="large" style={{ fontFamily: "monospace" }}>
                {String(Math.floor(seq.nowTick / 8)).padStart(3, '\xa0')}:{String((seq.nowTick % 8).toFixed(1)).padStart(2, '0')}
            </Label>
        </span>
        <span className="me-2">
            Beat: <Label size="large" style={{ fontFamily: "monospace" }}>4/4</Label>
        </span>
        <span className="me-2">
            Tempo: <Label size="large" style={{ fontFamily: "monospace" }}>{bpm}</Label>
        </span>
        <span>
            Key: <Label size="large" style={{ fontFamily: "monospace" }}>{scale}</Label>
        </span>
    </div>

    // OperationBar
    const SeqBar = <div>
        <Tooltip content="先頭へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.first} icon={<RewindIcon />} />
        </Tooltip>
        <Tooltip content="一小節前へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.prevMea} icon={<PrevIcon />} />
        </Tooltip>
        <Tooltip content={seq.isPlaying ? "一時停止" : "再生"} relationship="label" positioning="below-start">
            <Button className="mx-2" shape="circular" appearance="primary" onClick={play2} size="large" icon={seq.isPlaying ? <PauseIcon /> : <PlayIcon />} />
        </Tooltip>
        <Tooltip content="一小節先へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.nextMea} icon={<FastForwardIcon />} />
        </Tooltip>
        <Tooltip content="最後尾へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.last} icon={<LastIcon />} />
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
                className={"btn btn-sm " + (isMark ? "btn-primary" : "btn-dark")}
                key={mark.tick + mark.name}
                onClick={() => seq.setNowTick(mark.tick)}
            >
                {mark.name}
            </button>
        })}
    </div>
    
    
    const instBar = <div>
        <Select value={tracks[tabnum].program} onChange={(e) => changeProgram(Number(e.target.value))} >
            {tracks[tabnum].type === "drum" ? drums : programs}
        </Select>
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