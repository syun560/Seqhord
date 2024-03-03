"use client"
import React from "react"
import { useState, useEffect } from "react"
import { Note, Chord, Var } from './types.ts'
import { Ala } from './alealert.tsx'
import { default_text } from './default_txt/default_text.ts'
import { default_append } from './default_txt/default_append.ts'
import { default_bass } from './default_txt/default_bass.ts'
import { default_drum } from './default_txt/default_drum.ts'
import { compile } from './compile/compile.ts'
import { generate } from './generate.ts'
import Lib from './Lib.ts'
import './globals.css'

const default_notes:Note[][] = [
    [{ pitch: 64, pitch_name: 'C4', duration: 1, channel: 0, velocity: 100, tick: 0 }],
    [{ pitch: 64, pitch_name: 'C4', duration: 1, channel: 0, velocity: 100, tick: 0 }],
    [{ pitch: 64, pitch_name: 'C4', duration: 1, channel: 0, velocity: 100, tick: 0 }],
    [{ pitch: 64, pitch_name: 'C4', duration: 1, channel: 0, velocity: 100, tick: 0 }]
]

const default_chords:Chord[] = [
    {
        tick: 0,
        pitch: 0,
        chord_name: 'C',
        third: 'major',
        on: -1
    }
]

export default function Main() {
    const [texts, setTexts] = useState<string[]>([default_text,default_append,default_bass,default_drum])
    const [bpm, setBpm] = useState(120)
    const [mea, setMea] = useState(0)
    const [title, setTitle] = useState('none')
    const [errMsg, setErrMsg] = useState('')
    const [notes, setNotes] = useState<Note[][]>(default_notes)
    const [chords, setChords] = useState<Chord[]>(default_chords)
    const [midiURI, setMidiURI] = useState<string>()

    const [tabnum, setTabnum] = useState(0)
    const [vars, setVars] = useState<Var[]>([])


    const onMIDIGenerate = () => {
        const uri = generate(notes, bpm)
        setMidiURI(uri)
    }
    const onXMLGenerate = () => {
        const uri = generate(notes, bpm)
        setMidiURI(uri)
    }

    const onTextChange = (text: string) => {
        // console.log(texts)
        setTexts(texts.map((t, i) => (i === tabnum ? text : t)))
    }
    const onCompile = () => {
        const res = compile(texts)

        // 値のセット
        setNotes([...res.notes])
        setTitle(res.title)
        setErrMsg(res.errMsg)
        setBpm(res.bpm)
        setMea(res.mea)
        setChords(res.chords)
        setVars(res.vars)
    }
    const onTabChange = (t: number) => {
        setTabnum(t)
    }

    let estyle :React.CSSProperties = {
        whiteSpace: 'pre-wrap'
    }

    const max_note = [...notes[0]].sort((a,b)=>a.pitch>b.pitch ? 1: -1)[0].pitch
    const min_note = [...notes[0]].sort((a,b)=>a.pitch<b.pitch ? 1: -1)[0].pitch

    const ch_name = ['melody', 'append', 'bass', 'drum']

    useEffect(()=>{
        onTextChange(default_text)
    },[])

    return (
        <div className="container-fluid">
            <Ala />
            <div className="row">
                <div className="col-md-12">
                    <ul className="nav nav-tabs">
                    {ch_name.map((cn, i)=>{
                        return <li className="nav-item" key={i}>
                            <a className={"nav-link" + (i === tabnum ? " active" : "")} onClick={()=>onTabChange(i)}>{cn}</a>
                        </li>
                    })}
                    </ul>
                    <textarea className="form-control editor" value={texts[tabnum]} rows={20} cols={20} onChange={(e) => onTextChange(e.target.value)} />
                
                </div>
                <div style={estyle} className="col-md-12 border">
                    {errMsg}
                </div>
            </div>
            <button type="button" className="btn btn-primary mr-2" onClick={onCompile}>Compile</button>
            <button type="button" className="btn btn-success m-2" onClick={onMIDIGenerate}>to MIDI</button>
            <button type="button" className="btn btn-info m-2" onClick={onXMLGenerate}>to MusicXML</button>
                <a href={midiURI}>{midiURI}</a>
            <div className="row">
                <div className="col-3">
                <h5>Sys</h5>
                <table className="table table-sm">
                    <tbody>
                    <tr><th>Title</th><td>{title}</td></tr>
                    <tr><th>BPM</th><td>{bpm}</td></tr>
                    <tr><th>ノーツ数</th><td>{notes[tabnum].length}</td></tr>
                    <tr><th>mea</th><td>{mea}</td></tr>
                    <tr><th>最高音</th><td>{max_note}({Lib.noteNumberToNoteName(max_note)})</td></tr>
                    <tr><th>最低音</th><td>{min_note}({Lib.noteNumberToNoteName(min_note)})</td></tr>
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
                        <th>duration</th>
                    </tr>
                </thead>
                <tbody>
                {notes[tabnum].map((n,i)=><tr key={i}>
                    <td>{n.mea}</td>
                    <td>{n.tick % 8}</td>
                    {/* <td>{n.tick % 8}({n.tick})</td> */}
                    <td>{n.pitch_name}</td>
                    <td>{n.duration}</td></tr>)}
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
        </div>
    )
}
