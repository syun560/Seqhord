"use client"
import { useState } from "react"
import { Note } from './types.ts'
import { Ala } from './alealert.tsx'
import { default_text } from './default_text.ts'
import { compile } from './compile.ts'

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

const default_song = {
    title: 'test song',
    reso: 480,
    note: default_notes
}

export default function Main() {
    const [text, setText] = useState<string>(default_text)
    const [bpm, setBpm] = useState(120)
    const [title, setTitle] = useState('none')
    const [errMsg, setErrMsg] = useState('errMsg')
    const [notes, setNotes] = useState<Note[]>(default_notes)

    const onTextChange = (text: string) => {
        setText(text)

        const res = compile(text)

        // 値のセット
        setNotes([...res.notes])
        setTitle(res.title)
        setErrMsg(res.errMsg)
    }

    let estyle :React.CSSProperties = {
        whiteSpace: 'pre-wrap'
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Active</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                    </ul>

                    <textarea className="form-control" value={text} rows={20} cols={20} onChange={(e) => onTextChange(e.target.value)} />
                
                </div>
                <div style={estyle} className="col-md-12 border">
                    {errMsg}
                </div>
            </div>
            <div>
                <p>bpm: {bpm}</p>
                <p>title: {title}</p>
                <p>notes_length: {notes.length}</p>
                <p>mea: 128</p>
                <p>最高音: {[...notes].sort((a,b)=>a.pitch>b.pitch ? 1: -1)[0].pitch}</p>
                <p>最低音: {[...notes].sort((a,b)=>a.pitch<b.pitch ? 1: -1)[0].pitch}</p>
                {notes.map(n=><p>{n.tick},{n.pitch},{n.duration}</p>)}

                <button type="button" className="btn btn-primary">Generate</button>
            </div>
        </div>
    )
}
