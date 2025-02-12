import React, { memo, Dispatch, SetStateAction } from "react"
import { Track } from '../types.ts'
import Lib from "@/Lib";

type TrackSelectorProps = {
    tracks: Track[]
    nowTrack: number
    setNowTrack: Dispatch<SetStateAction<number>>
}

export const TrackSelector = memo(function trackSelector({ tracks, nowTrack, setNowTrack }: TrackSelectorProps) {

    return <div>
        <select className="form-select" value={nowTrack} onChange={(e) => setNowTrack(Number(e.target.value))}>
            {tracks.map((track, i) => <option value={i} key={track.ch + track.name}>{`Ch.${track.ch}: ${track.name} (${Lib.getProgramName(track.program,track.type === "drum")})`}</option>)}
        </select>
    </div>
    
})