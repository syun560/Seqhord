"use client"

// react
import React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/legacy/image"
import zundamon from "../public/zzm_zunmon027.png"

// types
import { Chord, Track_Info } from 'types'

// custom hook
import { useSequencer } from "./component/useSequencer"
import { useInstrument } from "./component/useInstrument"
import { useVoiceVox } from "./component/useVoicevox"

// component
import { Ala } from './component/alealert'
import { Disp } from './component/display'
import { LegPianoRoll } from './component/PianoRoll/LegPianoRoll'
// import { NewPianoRoll } from "./component/PianoRoll/NewPianoRoll"
import { TrackSelector } from './component/TrackSelector'
import { EditorComponent } from './component/EditorComponent'
import { Instrument } from "./component/Instrument"

// text
import { default_text } from './default_txt/default_text'
import { default_append } from './default_txt/default_append'
import { default_bass } from './default_txt/default_bass'
import { default_drum } from './default_txt/default_drum'
import { default_guitar } from './default_txt/default_guitar'

// script
import { compile } from './compile/compile'
import { generate_midi } from './generate/generate_midi'
import { generate_musicxml } from './generate/generate_musicxml'
import { loadJSON } from './importJSON'

import './globals.css'

const default_tracks: Track_Info[] = [
    {
        name: 'melody',
        program: 73,
        ch: 0,
        trans: 5,
        type: 'conductor',
        notes: [],
        texts: default_text,
        volume: 100,
        panpot: 64,
    }, {
        name: 'rhythm guitar',
        program: 4,
        ch: 1,
        trans: 5,
        type: 'chord',
        notes: [],
        texts: default_append,
        volume: 100,
        panpot: 64
    },
    {
        name: 'lead guitar',
        program: 4,
        ch: 2,
        trans: 5,
        type: 'chord',
        notes: [],
        texts: default_guitar,
        volume: 100,
        panpot: 64
    },
    {
        name: 'bass',
        program: 34,
        ch: 3,
        trans: 5,
        type: 'bass',
        notes: [],
        texts: default_bass,
        volume: 100,
        panpot: 64
    }, {
        name: 'drum',
        program: 0,
        ch: 10,
        trans: 5,
        type: 'drum',
        notes: [],
        texts: default_drum,
        volume: 100,
        panpot: 64
    }
]

export default function Main() {
    // useState
    const [tracks, setTracks] = useState<Track_Info[]>(default_tracks)
    const [bpm, setBpm] = useState(120)
    const [mea, setMea] = useState(0)
    const [title, setTitle] = useState('none')
    const [errMsg, setErrMsg] = useState('SMML Pad Ver0.1 ready...\n')
    const [chords, setChords] = useState<Chord[]>([])
    const [piano, setPiano] = useState(true)
    const [tabnum, setTabnum] = useState(0)
    const [rightTab, setRightTab] = useState("preview")
    const [autoCompile, setAutoCompile] = useState(true)
    const [autoFormat, setAutoFormat] = useState(true)

    const tabNames = ["preview", "info"]

    // custom hook
    const midi = useInstrument()
    const seq = useSequencer(midi, tracks, bpm)
    const vox = useVoiceVox()
    const timer = useRef<NodeJS.Timeout | null>(null);

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
    const VoiceSynth = async () => {
        try {
            await vox.synthVoice(tracks[0].notes, bpm)
        }
        catch (err) {
            console.error("VoiceSynth Error:", err)
        }
    }

    const onSave = (text: string) => {
        const a = document.createElement('a')
        a.download = `${title}.txt`
        a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
        a.click()
    }

    const onJson = () => {
        const a = document.createElement('a')
        a.download = `${title}.smml`
        a.href = URL.createObjectURL(new Blob([JSON.stringify(tracks)], { type: 'text/json' }))
        a.click()
    }

    const onNew = () => {
        tracks.forEach(track=>track.texts = "")
        setTracks([...tracks])        
    }

    const onFormat = () => {
        // 文字列をフォーマットする
    }

    const onTextChange = (text: string) => {
        // setTexts(texts.map((t, i) => (i === tabnum ? text : t)))
        const tk = [...tracks]
        tk[tabnum].texts = text
        setTracks(tk)
        if (autoCompile) {
            if (timer.current) { clearTimeout(timer.current); }
            timer.current = setTimeout(() => {
                onCompile()
            }, 3000)
        }
    }

    const onCompile = () => {
        const res = compile(tracks)

        // 値のセット
        // setNotes([...res.notes])
        setTracks([...res.tracks])
        setTitle(res.title)
        setErrMsg(errMsg + res.errMsg)
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
            texts: '',
            volume: 100,
            panpot: 64
        }
        ])
    }
    const onDeleteTab = (t: number) => {
        const conf = confirm('トラックを削除しますか？（この操作は取り消しできません）')
        if (!conf) return
        const tmp_tracks = [...tracks]
        tmp_tracks.splice(t, 1)
        setTracks(tmp_tracks)
        setTabnum(0)
    }

    const handleBeforeUnload = (e: any) => {
        e.preventDefault()
        e.returnValue = "ページを離れますか？（変更は保存されません）"
    }

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        onCompile()
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, [])

    return (
        <div className="container-fluid">
            <div className="ctr-pane" >

                {/* <Ala /> */}
                <input type='file' accept='.json, .smml' onChange={(e) => loadJSON(e, setTracks)} />
                <button type="button" className="btn btn-dark" onClick={onNew}>
                    New
                </button>
                <button type="button" className="btn btn-dark" onClick={onJson}>
                    Save
                </button>
                {/* <button type="button" className="btn btn-warning m-1" onClick={() => onSave(tracks[tabnum].texts)}>
                    <Image src="/save.png" width={40} height={40} alt="save" />
                    to Text
                </button> */}
                <button type="button" className="btn btn-dark" onClick={onCompile}>
                    {/* <Image src="/midi.png" width={40} height={40} alt="Compile" /> */}
                    Compile
                </button>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" checked={autoCompile} onChange={() => setAutoCompile(!autoCompile)} />
                    <label className="form-check-label">auto compile</label>
                </div>

                <button type="button" className="btn btn-dark" onClick={onMIDIGenerate}>
                    {/* <Image src="/midi.png" width={40} height={40} alt="to MIDI" /> */}
                    MIDI
                </button>
                <button type="button" className="btn btn-dark" onClick={onXMLGenerate}>
                    {/* <Image src="/midi2.png" width={40} height={40} alt="to MusicXML" /> */}
                    MusicXML
                </button>

                <button type="button" className="btn btn-dark" onClick={VoiceSynth}>
                    VoiceSynth
                </button>

                {/* <button type="button" className="btn btn-info m-1" onClick={() => setPiano(!piano)}>
                    <Image src="/piano.png" width={40} height={40} alt="PianoRoll" />
                    PianoRoll
                </button> */}

                {/* <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" checked={autoFormat} onChange={() => setAutoFormat(!autoFormat)} />
                    <label className="form-check-label">auto format</label>
                </div> */}

                <button type="button" className="btn btn-dark" onClick={midi.load}>
                    useMIDI
                </button>

                <button type="button" className="btn btn-dark">
                    auto compose
                </button>

                <Instrument midi={midi} />

                <span>
                    <button className="btn btn-secondary mx-1" onClick={seq.first}>
                        l＜
                    </button>
                    <button className="btn btn-primary me-1" onClick={seq.playToggle}>
                        {seq.isPlaying ? 'II' : '▶'}
                    </button>
                    <span>{seq.nowTick}</span>
                </span>
            </div>

            <div className="row">

                {/* Left Pane */}
                <div className="col-md-6 pe-0 pane">

                    <TrackSelector tracks={tracks} tabnum={tabnum} onAddTrack={onAddTrack} onTabChange={onTabChange} onDeleteTab={onDeleteTab} />

                    <div style={{ height: "calc(100% - 42px)" }}>
                        {tracks[tabnum] === undefined ? '' :
                            // <textarea className="form-control editor m-0 bar" value={tracks[tabnum].texts} rows={32} cols={20} onChange={(e) => onTextChange(e.target.value)} wrap="off" />
                            <EditorComponent value={tracks[tabnum].texts} doChange={onTextChange} />
                        }

                        <textarea
                            style={{ height: "20%" }}
                            className="form-control m-0 overflow-auto"
                            value={errMsg}
                            readOnly />
                    </div>

                </div>


                {/* Right Pane */}
                <div className="col-md-6 ps-0 pane">
                    <ul className="nav nav-tabs">
                    {tabNames.map(t=><li className="nav-item">
                        <a className={"pointer nav-link" + (t === rightTab ? " active" : "")} onClick={()=>setRightTab(t)}>
                            {t}
                        </a>
                        </li>
                    )}
                    </ul>

                    <div style={{ height: "calc(100% - 42px)", overflow: "scroll" }}>
                        {/* PianoRoll, info, etc... */}
                        {rightTab === "preview" ?
                        tracks[tabnum] === undefined || tracks[tabnum].notes === undefined ?
                            '' :
                            piano ?
                                <LegPianoRoll notes={tracks[tabnum].notes} seq={seq} />
                                // <NewPianoRoll notes={tracks[tabnum].notes} seq={seq} />
                                :
                                <Disp title={title} bpm={bpm} mea={mea} notes={tracks[tabnum].notes} chords={chords} />
                        :
                        <div>info</div>
                        }

                        {/* float element */}
                        <div className="fixed-div" style={vox.audioData ? {opacity: 0.7} : {opacity: 0.3} }>
                            <Image src={zundamon} alt="singer" layout="fill" objectFit="contain" priority={true} />
                            {vox.audioData ?
                                <audio
                                    controls
                                    src={vox.audioData ? window.URL.createObjectURL(vox.audioData) : undefined}>
                                </audio>
                                : <></>}
                        </div>

                        

                    </div>

                </div>
            </div>
        </div>
    )
}
