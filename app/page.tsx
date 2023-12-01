"use client"
import { useState } from "react"
import { Note } from './types.ts'
import { Ala } from './alealert.tsx'
import { default_text } from './default_text.ts'
import { compile } from './compile.ts'

const default_notes:Note[] = [
    {
        pitch: 'C4',
        duration: 'T4',
        channel: 0,
        velocity: 100,
        tick: 0
    },
    {
        pitch: 'C5',
        duration: 'T4',
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
        const tmp_notes:Note[] = []
        compile(text)

        // notesのセット
        setNotes([...tmp_notes])
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6">
                    <textarea className="form-control" value={text} rows={20} cols={20} onChange={(e) => onTextChange(e.target.value)} />
                </div>
                <div className="col-md-6 border">
                    {errMsg}
                </div>
            </div>
            <div>
                <p>bpm: {bpm}</p>
                <p>title: {title}</p>
                <p>最高音:</p>
                <p>最低音:</p>

                <button type="button" className="btn btn-primary">Button</button>
            </div>
        </div>
    )
}
