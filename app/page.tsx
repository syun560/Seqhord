"use client"
import React from "react"
import { useState, useEffect } from "react"
import { Chord, Track_Info } from './types.ts'

// component
import { Ala } from './component/alealert.tsx'
import { Disp } from './component/display.tsx'
import { PianoRoll } from './component/PianoRoll/PianoRoll.tsx'
import { TrackSelector } from './component/TrackSelector.tsx'

// text
import { default_text } from './default_txt/default_text.ts'
import { default_append } from './default_txt/default_append.ts'
import { default_bass } from './default_txt/default_bass.ts'
import { default_drum } from './default_txt/default_drum.ts'

// script
import { compile } from './compile/compile.ts'
import { generate_midi } from './generate/generate_midi.ts'
import { generate_musicxml } from './generate/generate_musicxml.ts'

import './globals.css'

const default_tracks:Track_Info[] = [
    {
        name: 'melody',
        program: 73,
        ch: 0,
        trans: 5,
        type: 'conductor',
        notes: [],
        texts: default_text,
    },{
        name: 'append',
        program: 4,
        ch: 0,
        trans: 5,
        type: 'chord',
        notes: [],
        texts: default_append,
    },{
        name: 'bass',
        program: 34,
        ch: 0,
        trans: 5,
        type: 'bass',
        notes: [],
        texts: default_bass
    },{
        name: 'drum',
        program: 0,
        ch: 10,
        trans: 5,
        type: 'drum',
        notes: [],
        texts: default_drum
    }
]

export default function Main() {
    const [tracks, setTracks] = useState<Track_Info[]>(default_tracks)
    const [bpm, setBpm] = useState(120)
    const [mea, setMea] = useState(0)
    const [title, setTitle] = useState('none')
    const [errMsg, setErrMsg] = useState('')
    const [chords, setChords] = useState<Chord[]>([])
    const [piano, setPiano] = useState(false)

    const [tabnum, setTabnum] = useState(0)

    const onMIDIGenerate = () => {
        const uri = generate_midi(tracks, bpm)
        const a = document.createElement('a')
        a.download = `${title}.mid`
        a.href = uri
        a.click()
    }
    const onXMLGenerate = () => {
        const xml = generate_musicxml(0, tracks[0].notes, bpm)
        const blob = new Blob([xml], {
            type: 'text/plain;charset=utf-8',
        });
        const a = document.createElement('a')
        a.download = `${title}.musicxml`
        a.href = URL.createObjectURL(blob)
        a.click()
    }

    const onTextChange = (text: string) => {
        // setTexts(texts.map((t, i) => (i === tabnum ? text : t)))
        const tk = [...tracks]
        tk[tabnum].texts = text
        setTracks(tk)
    }
    const onCompile = () => {
        const res = compile(tracks)

        // 値のセット
        // setNotes([...res.notes])
        setTracks([...res.tracks])
        setTitle(res.title)
        setErrMsg(res.errMsg)
        setBpm(res.bpm)
        setMea(res.mea)
        setChords(res.chords)
    }
    const onTabChange = (t: number) => {
        setTabnum(t)
    }
    const onAddTrack = () => {
        if (tracks.length > 16) return
        setTracks([...tracks,
            {
            name: 'new_track',
            program: 0,
            ch: 0,
            trans: 5,
            type: 'bass',
            notes: [],
            texts: ''
            }
        ])
    }
    const onDeleteTab = (t:number) => {
        const conf = confirm('トラックを削除しますか？（取り消し不可）')
        if (!conf) return
        const tmp_tracks = [...tracks]
        tmp_tracks.splice(t,1)
        setTracks(tmp_tracks)
        setTabnum(0)
    }

    let estyle :React.CSSProperties = {
        whiteSpace: 'pre-wrap'
    }

    const handleBeforeUnload = (e:any) => {
        e.preventDefault()
        e.returnValue = "本当にページを離れますか？"
    }

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, [])

    return (
        <div className="container-fluid">
            <Ala />
            <button type="button" className="btn btn-primary my-2" onClick={onCompile}>Compile</button>
            <button type="button" className="btn btn-success m-2" onClick={onMIDIGenerate}>to MIDI</button>
            <button type="button" className="btn btn-secondary m-2" onClick={onXMLGenerate}>to MusicXML</button>
            <button type="button" className="btn btn-info m-2" onClick={()=>setPiano(!piano)}>PianoRoll</button>
            
            <div className="row">
                <div className="col-md-12">
                    
                    <TrackSelector tracks={tracks} tabnum={tabnum} onAddTrack={onAddTrack} onTabChange={onTabChange} onDeleteTab={onDeleteTab} />
                    { tracks[tabnum] === undefined  ? '' :
                    <textarea className="form-control editor" value={tracks[tabnum].texts} rows={20} cols={20} onChange={(e) => onTextChange(e.target.value)} />
                    }
                </div>
                <div style={estyle} className="col-md-12 border">
                    {errMsg}
                </div>
            </div>
                        
            { tracks[tabnum] === undefined || tracks[tabnum].notes === undefined ? '' :
            piano ? <PianoRoll notes={tracks[tabnum].notes} />
            :<Disp title={title} bpm={bpm} mea={mea} notes={tracks[tabnum].notes} chords={chords} />
            }
        </div>
    )
}
