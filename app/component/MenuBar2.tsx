import React, { memo } from "react"
import { Sequencer, Mark } from "@/types";
import Lib from '../Lib'

// fluent ui
import {
    Button, Label, Tooltip, ToolbarButton, ToolbarDivider,
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
    seq: Sequencer
    scale: string
    bpm: number
    audioRef: React.RefObject<HTMLAudioElement>
    marks: Mark[]
}

export const MenuBar2 = memo(function MenuBar({ seq, bpm, audioRef, scale, marks }: MenuBarPropsType) {

    const play2 = () => {
        seq.playToggle()
        const audio = audioRef.current
        if (!audio) return
        audio.paused ? audio.play() : audio.pause()
    }

    // コンダクトバー
    const ConductBar = <div className="m-1 p-1" style={{background: "#445"}}>
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

    return <div className="d-flex bg-black">
        {ConductBar}
        <ToolbarDivider className="py-2"/>
        {SeqBar}
        <ToolbarDivider className="py-2"/>
        <Button key="defalut" appearance="subtle" onClick={()=>seq.setNowTick(8)}>Start</Button>
        {marks.map(mark=><Button key={mark.tick + mark.name} appearance="subtle" onClick={()=>seq.setNowTick(mark.tick)}>{mark.name}</Button>)}
    </div>
})