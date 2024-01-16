"use client"
import React from "react"
// import { notojp } from "../utiles/font.ts"
import { useState, useEffect } from "react"
import { Note, Chord } from './types.ts'
import { Ala } from './alealert.tsx'
import { default_text } from './default_text.ts'
import { compile } from './compile.ts'
import { generate } from './generate.ts'
import Lib from './Lib.ts'
import './globals.css'

const default_notes:Note[] = [
    {
        pitch: 64,
        pitch_name: 'C4',
        duration: 1,
        channel: 0,
        velocity: 100,
        tick: 0
    },
    {
        pitch: 63,
        pitch_name: 'C5',
        duration: 1,
        channel: 0,
        velocity: 100,
        tick: 0
    },
]

const default_chords:Chord[] = [
    {
        pitch: 64,
        chord_name: 'C',
        tick: 0
    }
]

export default function Main() {
    const [text, setText] = useState<string>(default_text)
    const [bpm, setBpm] = useState(120)
    const [mea, setMea] = useState(0)
    const [title, setTitle] = useState('none')
    const [errMsg, setErrMsg] = useState('errMsg')
    const [notes, setNotes] = useState<Note[]>(default_notes)
    const [chords, setChords] = useState<Chord[]>(default_chords)
    const [midiURI, setMidiURI] = useState<string>('')

    const onGenerate = () => {
        const uri = generate(notes, bpm)
        setMidiURI(uri)
    }

    const onTextChange = (text: string) => {
        setText(text)

        const res = compile(text)

        // 値のセット
        setNotes([...res.notes])
        setTitle(res.title)
        setErrMsg(res.errMsg)
        setBpm(res.bpm)
        setMea(res.mea)
        setChords(res.chords)
    }

    useEffect(()=>{
        onTextChange(default_text)
    },[])

    let estyle :React.CSSProperties = {
        whiteSpace: 'pre-wrap'
    }

    const max_note = [...notes].sort((a,b)=>a.pitch>b.pitch ? 1: -1)[0].pitch
    const min_note = [...notes].sort((a,b)=>a.pitch<b.pitch ? 1: -1)[0].pitch

    return (
        <div className="container-fluid">
            <Ala />
            <div className="row">
                <div className="col-md-12">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Ch.1</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Ch.2</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Ch.3</a>
                        </li>
                    </ul>

                    {/* <textarea className={`form-control ${notojp.className}`} value={text} rows={20} cols={20} onChange={(e) => onTextChange(e.target.value)} /> */}
                    <textarea className="form-control editor" value={text} rows={20} cols={20} onChange={(e) => onTextChange(e.target.value)} />
                
                </div>
                <div style={estyle} className="col-md-12 border">
                    {errMsg}
                </div>
            </div>
            <div>
                <p>bpm: {bpm}</p>
                <p>title: {title}</p>
                <p>notes_length: {notes.length}</p>
                <p>mea: {mea}</p>
                <p>最高音: {max_note}({Lib.noteNumberToNoteName(max_note)})</p>
                <p>最低音: {min_note}({Lib.noteNumberToNoteName(min_note)})</p>
                <p>{notes.map((n,i)=><React.Fragment key={i}>{n.tick},{n.pitch_name},{n.duration}<br /></React.Fragment>)}</p>
                <p>{chords.map((c,i)=><React.Fragment key={i}>{c.tick},{c.chord_name}<br /></React.Fragment>)}</p>

                <button type="button" className="btn btn-primary" onClick={onGenerate}>Generate</button>
                <p><a href={midiURI}>{midiURI}</a></p>
            </div>
        </div>
    )
}
