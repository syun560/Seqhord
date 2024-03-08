import React from "react"
import { useState } from "react"
import { Track_Info } from '../types.ts'

interface Props {
    tracks: Track_Info[]
    tabnum: number
    onTabChange: (param : number) => void
    onAddTrack: ()=>void
    onDeleteTab: (param: number) => void
}

export const TrackSelector : React.FC<Props> = ({tracks, tabnum, onTabChange, onAddTrack, onDeleteTab}) => {

    const [state, setState] = useState(0)

    return <ul className="nav nav-tabs">
    {tracks.map((cn, i)=>{
        return <li className="nav-item" key={i}>
            <a className={"pointer nav-link" + (i === tabnum ? " active" : "")} onClick={()=>onTabChange(i)}>{cn.name}
            {tabnum===i ?<button type="button" onClick={()=>onDeleteTab(i)} className="btn btn-sm ps-2 pe-0 py-0">✕</button>:<></>}
            </a>
        </li>
    })}
        <li className="nav-item" key={1000}>
            <a className="pointer nav-link" onClick={onAddTrack}>+</a>
        </li>
    </ul>
}