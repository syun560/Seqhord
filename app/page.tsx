"use client"
import { useState } from "react"
import { Ala } from './alealert.tsx'
import { default_text } from './default_text.ts'

const default_notes = [
    {
        pitch: "C4",
        duration: "T4",
        channel: 0,
        velocity: 100,
        tick: 0
    },
    {
        pitch: "C5",
        duration: "T4",
        channel: 0,
        velocity: 100,
        tick: 0
    },
]

const default_song = {
    title: "test song",
    reso: 480,
    note: default_notes
}

export default function Main() {
    const [text, setText] = useState<string>(default_text)
    const [bpm, setBpm] = useState(120)
    const [title, setTitle] = useState('none')
    const [errMsg, setErrMsg] = useState('errMsg')
    const [notes, setNotes] = useState('notes')

    const compile = (text: string) => {
        setText(text)

        // 文字列を改行ごとに分割して配列に入れる
        const lines = text.split('\n')
        const notes = []
        let tick = 0
        let reso = 480

        // 文字列を検索する
        lines.forEach((line, i) => {
            // 行数制限
            if (i > 500) {
                setErrMsg('入力可能な最大行数(500行)を超えています。コンパイルを中止します。')
                return
            }

            // @キーワード
            if (line.indexOf('@') !== -1) {
                // BPM
                if (line.indexOf('b') !== -1) {
                    const i = line.indexOf('=')
                    const b = Number(line.slice(i + 1))
                    setBpm(b)
                }
                // タイトル
                else if (line[1] === 't') {
                    const i = line.indexOf('=')
                    const t = line.slice(i + 1)
                    setTitle(t)
                }
                // note
                else if (line[0] === 'm') {
                    for (let i = 0; i < line.length; i++) {
                        const c = line[i]
                        if (c === '+') {

                        }
                        else if (c === '-') {

                        }
                        else if (c === '_') {
                            tick += reso
                        }
                        // 数値であればnoteとして認識する
                        else if (!isNaN(Number(c))) {
                            const note = Number(c)
                            console.log(note)
                            notes.push({
                                pitch: "C5",
                                duration: "T4",
                                channel: 0,
                                velocity: 100,
                                tick: tick
                            })
                            tick += reso
                        }
                        else {
                            // エラー
                            setErrMsg(`${i}行目: 予期せぬ文字列「${c}」です。`)
                        }
                    }
                }
            }
        })

    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6">
                    <textarea className="form-control" value={text} rows={20} cols={20} onChange={(e) => compile(e.target.value)} />
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
