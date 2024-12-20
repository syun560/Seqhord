import React from "react"
import { Note, Chord } from '../types.ts'

export const Disp : React.FC<{title: string; bpm: number; mea: number; notes: Note[]; chords: Chord[];}> = ({title, bpm, mea, notes, chords}) =>{
    return (
        <div className="row mt-3">
        <div className="col-4">
        <h5>Sys</h5>
        <table className="table table-sm">
            <tbody>
            <tr><th>Title</th><td>{title}</td></tr>
            <tr><th>BPM</th><td>{bpm}</td></tr>
            <tr><th>mea</th><td>{mea}</td></tr>
            </tbody>
        </table>
        </div>

        <div className="col-4">
        <h5>Note</h5>
        <table className="table table-sm">
        <thead>
            <tr>
                <th>tick%8</th>
                <th>pitch</th>
                <th>dur</th>
                <th>lyric</th>
            </tr>
        </thead>
        <tbody>
        {notes === undefined ? '' : notes.map((n,i)=><tr key={i}>
            <td>{n.tick % 8}</td>
            <td>{n.pitch_name}</td>
            <td>{n.duration}</td>
            <td>{n.lyric}</td></tr>)}
        </tbody></table>
        </div>

        <div className="col-4">
        <h5>Chord</h5>
        <table className="table table-sm">
        <thead>
            <tr>
                <th>tick</th>
                <th>name</th>
                <th>on</th>
                <th>third</th>
            </tr>
        </thead>
        <tbody>
        {chords.map((c,i)=><tr key={i}>
            <td>{c.tick}</td>
            <td>{c.chord_name}</td>
            <td>{c.on}</td>
            <td>{c.third}</td></tr>)}
        </tbody></table>
        </div>

    </div>
    )
}