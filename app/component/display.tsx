import React from "react"
import { Note, Chord, Var } from '../types.ts'

export const Disp : React.FC<{title: string; bpm: number; mea: number; notes: Note[][]; chords: Chord[]; vars: Var[]; tabnum: number}> = ({title, bpm, mea, notes, chords, vars, tabnum}) =>{
    return (
        <div className="row">
        <div className="col-3">
        <h5>Sys</h5>
        <table className="table table-sm">
            <tbody>
            <tr><th>Title</th><td>{title}</td></tr>
            <tr><th>BPM</th><td>{bpm}</td></tr>
            <tr><th>mea</th><td>{mea}</td></tr>
            </tbody>
        </table>
        </div>

        <div className="col-3">
        <h5>Note</h5>
        <table className="table table-sm">
        <thead>
            <tr>
                <th>mea</th>
                <th>tick%8</th>
                <th>pitch</th>
                <th>dur</th>
                <th>lyric</th>
            </tr>
        </thead>
        <tbody>
        {notes === undefined ? '' : notes[tabnum].map((n,i)=><tr key={i}>
            <td>{n.mea}</td>
            <td>{n.tick % 8}</td>
            <td>{n.pitch_name}</td>
            <td>{n.duration}</td>
            <td>{n.lyric}</td></tr>)}
        </tbody></table>
        </div>

        <div className="col-3">
        <h5>Chord</h5>
        <table className="table table-sm">
        <thead>
            <tr>
                <th>mea</th>
                <th>tick</th>
                <th>name</th>
                <th>third</th>
            </tr>
        </thead>
        <tbody>
        {chords.map((c,i)=><tr key={i}>
            <td>{c.mea}</td>
            <td>{c.tick}</td>
            <td>{c.chord_name}</td>
            <td>{c.third}</td></tr>)}
        </tbody></table>
        </div>

        <div className="col-3">
        <h5>Var</h5>
        <table className="table table-sm">
        <thead>
            <tr>
                <th>tick</th>
                <th>name</th>
                <th>repeat</th>
            </tr>
        </thead>
        <tbody>
        {vars.map((c,i)=><tr key={i}>
            <td>{c.tick}</td>
            <td>{c.name}</td>
            <td>{c.repeat}</td>
        </tr>)}
        </tbody></table>
        </div>

    </div>
    )
}