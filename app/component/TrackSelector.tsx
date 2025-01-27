import React, { memo, Dispatch, SetStateAction } from "react"
import { Track } from '../types.ts'
import Lib from "@/Lib";

// fluent ui
import {
    Select, Button, Tooltip, ToolbarButton, 
} from "@fluentui/react-components"

import {
    bundleIcon,
    AddCircleFilled,
    DismissFilled
} from "@fluentui/react-icons"

type TrackSelectorProps = {
    tracks: Track[]
    nowTrack: number
    onAddTrack: () => void
    onDeleteTab: (param: number) => void
    setNowTrack: Dispatch<SetStateAction<number>>
}

export const TrackSelector = memo(function trackSelector({ tracks, nowTrack, onAddTrack, onDeleteTab, setNowTrack }: TrackSelectorProps) {

    // console.log("Trackselector rendered")

    return <>
        <Select value={nowTrack} onChange={(e) => setNowTrack(Number(e.target.value))}>
            {tracks.map((track, i) => <option value={i} key={track.ch + track.name}>{`Ch.${track.ch}: ${track.name} (${Lib.getProgramName(track.program,track.type === "drum")})`}</option>)}
        </Select>

        <Tooltip content="トラックを追加" relationship="label" positioning="below-start">
            <ToolbarButton onClick={onAddTrack} appearance="transparent" icon={<AddCircleFilled />}></ToolbarButton>
        </Tooltip>
        
        <Tooltip content="トラックの削除" relationship="label" positioning="below-start">
            <ToolbarButton onClick={()=>onDeleteTab(nowTrack)} appearance="transparent" icon={<DismissFilled />} disabled={nowTrack === 0}></ToolbarButton>
        </Tooltip>
    </>
})