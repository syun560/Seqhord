import React, { memo, Dispatch, SetStateAction } from "react"

import { Track, MIDI } from 'types'
import { RotaryKnob } from "./RotaryKnob"
import Lib from "@/Lib";

type VariablesPropsType = {
    tracks: Track[]
    midi: MIDI
    nowTrack: number

    setTracks: Dispatch<SetStateAction<Track[]>>
    setNowTrack: Dispatch<SetStateAction<number>>
}

export const Mixer = memo(function Mixer ({tracks, setTracks, nowTrack, setNowTrack, midi}:VariablesPropsType) {
    const setVolume = (value: number, ch: number) => {
        const res = [...tracks]
        res[ch].volume = value
        setTracks(res)

        midi.setVolume(value, tracks[ch].ch)
    }

    const setPanpot = (value: number, ch: number) => {
        const res = [...tracks]
        res[ch].panpot = value
        setTracks(res)

        midi.controlChange(tracks[ch].ch, 10, value) //
    }

    const setReverb = (value: number, ch: number) => {
        const res = [...tracks]
        res[ch].reverb = value
        setTracks(res)

        midi.controlChange(tracks[ch].ch, 91, value) //
    }

    return <table className="table table-hover align-middle text-center">
        <thead>
            <tr>
                <th>CH</th>
                <th>NAME</th>
                {/* <th>TYPE</th> */}
                <th>PROGRAM</th>
                <th>VOL</th>
                <th>PAN</th>
                <th>REV</th>
            </tr>
        </thead>
        <tbody>
            {tracks.map((track, i)=><tr className={i === nowTrack ? "table-active" : ""} key={track.name + track.ch}>
                <td onClick={()=>setNowTrack(i)}>{track.ch}</td>
                <td onClick={()=>setNowTrack(i)}>{track.name}</td>
                {/* <td>{track.type}</td> */}
                <td onClick={()=>setNowTrack(i)}>{Lib.getProgramName(track.program,track.type === "drum")}</td>
                <td><RotaryKnob onChange={(val: number)=>setVolume(val, i)} value={track.volume} min={0} max={127} /></td>
                <td><RotaryKnob onChange={(val: number)=>setPanpot(val, i)} value={track.panpot} min={0} max={127} /></td>
                <td><RotaryKnob onChange={(val: number)=>setReverb(val, i)} value={track.reverb} min={0} max={127} /></td>
            </tr>)}
        </tbody>
    </table> 

})