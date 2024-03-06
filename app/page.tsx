"use client"
import React from "react"
import { useState, useEffect } from "react"
import { Note, Chord, Var } from './types.ts'

import { Ala } from './component/alealert.tsx'
import { Disp } from './component/display.tsx'

import { default_text } from './default_txt/default_text.ts'
import { default_append } from './default_txt/default_append.ts'
import { default_bass } from './default_txt/default_bass.ts'
import { default_drum } from './default_txt/default_drum.ts'

import { compile } from './compile/compile.ts'
import { generate_midi } from './generate/generate_midi.ts'
import { generate_musicxml } from './generate/generate_musicxml.ts'

import './globals.css'

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
    const [notes, setNotes] = useState<Note[][]>()
    const [chords, setChords] = useState<Chord[]>(default_chords)
    const [midiURI, setMidiURI] = useState<string>('')

    const [tabnum, setTabnum] = useState(0)
    const [vars, setVars] = useState<Var[]>([])


    const onMIDIGenerate = () => {
        if(notes === undefined) return
        const uri = generate_midi(notes, bpm)
        setMidiURI(uri)
        window.location.href = uri
    }
    const onXMLGenerate = () => {
        if (notes === undefined) return
        const xml = generate_musicxml(0, notes[0], bpm)
        const blob = new Blob([xml], {
            type: 'text/plain;charset=utf-8',
        });
        const a = document.createElement('a');
        a.download = 'score.musicxml';
        a.href = URL.createObjectURL(blob);
        a.click();
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
                            <a className={"pointer nav-link" + (i === tabnum ? " active" : "")} onClick={()=>onTabChange(i)}>{cn}</a>
                        </li>
                    })}
                    </ul>
                    <textarea className="form-control editor" value={texts[tabnum]} rows={20} cols={20} onChange={(e) => onTextChange(e.target.value)} />
                
                </div>
                <div style={estyle} className="col-md-12 border">
                    {errMsg}
                </div>
            </div>
            <button type="button" className="btn btn-primary my-2" onClick={onCompile}>Compile</button>
            
            { notes === undefined ? '' :<>
            <button type="button" className="btn btn-success m-2" onClick={onMIDIGenerate}>to MIDI</button>
            <button type="button" className="btn btn-info m-2" onClick={onXMLGenerate}>to MusicXML</button>
            
            <Disp title={title} bpm={bpm} mea={mea} notes={notes} chords={chords} vars={vars} tabnum={tabnum} />
            </>}
        </div>
    )
}
