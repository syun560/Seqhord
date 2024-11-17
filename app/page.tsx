"use client"

// react
import React from "react"
import { useState, useEffect, useRef } from "react"

// fluent ui
import { FluentProvider, webDarkTheme, Button, Select, Label } from "@fluentui/react-components"
import {
    bundleIcon,
    PlayRegular, PlayFilled, PauseRegular, PauseFilled, RewindRegular, RewindFilled, FastForwardRegular, FastForwardFilled,
    MidiRegular, MidiFilled,
} from "@fluentui/react-icons"
const PlayIcon = bundleIcon(PlayRegular, PlayFilled)
const PauseIcon = bundleIcon(PauseRegular, PauseFilled)
const RewindIcon = bundleIcon(RewindRegular, RewindFilled)
const FastForwardIcon = bundleIcon(FastForwardRegular, FastForwardFilled)
const MidiIcon = bundleIcon(MidiRegular, MidiFilled)

// types
import { Chord, Track, Var2 } from 'types'

// defalut val
import { default_tracks } from "./default_vals/defalut_tracks"

// custom hook
import { useSequencer } from "./custom_hooks/useSequencer"
import { useInstrument } from "./custom_hooks/useInstrument"
import { useVoiceVox } from "./custom_hooks/useVoicevox"
import { useConsole } from "./custom_hooks/useConsole"

// component
import { Disp } from './component/display'
import { PianoRoll } from './component/PianoRoll/PianoRoll'
// import { NewPianoRoll } from "./component/PianoRoll/NewPianoRoll"
import { TrackSelector } from './component/TrackSelector'
import { SMMLEditor } from './component/SMMLEditor'
import { Instrument } from "./component/Instrument"
import { Singer } from "./component/Singer"
import { Variables } from "./component/Variables"
import { MenuComponent } from "./component/MenuComponent"

// script
import { compile } from './compile/compile'
import { generate_midi } from './generate/generate_midi'
import { generate_musicxml } from './generate/generate_musicxml'
import { loadJSON } from './loadJSON'
import Lib from './Lib'

import './styles.css'

const programs = Lib.programName.map((p, i)=><option key={i} value={i}>{String(i).padStart(3, '0')}: {p}</option>)

export default function Main() {
    // State
    const [tracks, setTracks] = useState<Track[]>(default_tracks)
    const [bpm, setBpm] = useState(120)
    const [mea, setMea] = useState(0)
    const [title, setTitle] = useState('none')
    const [chords, setChords] = useState<Chord[]>([])
    const [vars, setVars] = useState<Var2[]>([])
    const [piano, setPiano] = useState(true)
    
    const [tabnum, setTabnum] = useState(0)
    const [rightTab, setRightTab] = useState("preview")
    
    
    const [autoCompile, setAutoCompile] = useState(true)
    const [autoFormat, setAutoFormat] = useState(true)
    const [maxTick, setMaxTick] = useState(0)

    const tabNames = ["preview", "vars"]

    // custom hook
    const midi = useInstrument()
    const seq = useSequencer(midi, tracks, bpm)
    const vox = useVoiceVox()
    const log = useConsole()
    const timer = useRef<NodeJS.Timeout | null>(null);

    const simpleDownload = (title: string, url: string) => {
        const a = document.createElement('a')
        a.download = title
        a.href = url
        a.click()
    }

    const saveMIDI = () => {
        const uri = generate_midi(tracks, bpm)
        simpleDownload(`${title}.mid`, uri)
    }
    const saveMusicXML = () => {
        const xml = generate_musicxml(0, tracks[0].notes, bpm)
        const blob = new Blob([xml], { type: 'text/plain;charset=utf-8' })
        simpleDownload(`${title}.musicxml`, URL.createObjectURL(blob))
    }
    const saveText = () => {
        const text = tracks[tabnum].texts
        simpleDownload(`${title}.txt`, 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    }
    const saveAsJson = () => {
        simpleDownload(`${title}.smml`, URL.createObjectURL(new Blob([JSON.stringify(tracks)], { type: 'text/json' })))
    }

    const onNew = () => {
        if (confirm('新規作成しますか？（現在のデータは削除されます）')) {
            tracks.forEach(track=>track.texts = "")
            setTracks([...tracks])
        }
        onCompile()
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
        log.addLog(res.errMsg)
        setBpm(res.bpm)
        setMea(res.mea)
        setVars(res.vars)
        setChords(res.chords)
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

    const showOpenFileDialog = () => new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json, .smml'
        input.onchange = async () => { 
            resolve((()=>{
                loadJSON(input.files, setTracks, setBpm)
            })()) 
        }
        input.click()
    })

    const autoCompose = () => {
        log.addLog("auto compose")
    }

    const menuFunc = {
        saveAsJson, showOpenFileDialog ,onCompile, onNew, saveMIDI, saveMusicXML, saveText,
        autoCompose
    }

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload)
        onCompile()
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    // MaxTickを求める
    useEffect(() => {
        let m = 0
        tracks.forEach(t=>{
            if(t.notes.length > 0 && t.notes.at(-1)!.tick > m) {
                m = t.notes.at(-1)!.tick
            }
        })
        setMaxTick(m)
    }, [tracks])

    return (
        <FluentProvider theme={webDarkTheme}>

        <div className="container-fluid">
            <div>
                <MenuComponent f={menuFunc} seq={seq}/>         
                <br />
                <span>
                    {/* <span className="me-2">
                        Tick: <Label size="large" style={{fontFamily: "monospace"}}>
                            {String(seq.nowTick).padStart(3, '0')}/{String(maxTick).padStart(3, '0')}
                        </Label>
                    </span> */}
                    <span className="me-2">
                        Tick: <Label size="large" style={{fontFamily: "monospace"}}>
                            {String(Math.floor(seq.nowTick/8)).padStart(3, '\xa0')}:{String(seq.nowTick%8).padStart(2, '0')} / {Math.floor(maxTick/8)}:{maxTick%8}
                        </Label>
                    </span>
                    <span className="me-2">
                        Beat: <Label size="large" style={{fontFamily: "monospace"}}>4/4</Label>
                    </span>
                    <span className="me-2">
                        Tempo: <Label  size="large" style={{fontFamily: "monospace"}}>{bpm}</Label>
                    </span>
                    {/* <span className="me-2">Key: G</span> */}
                </span>

                <span className="mx-3">
                    <Button className="me-2" onClick={seq.first} icon={<RewindIcon />} />
                    <Button className="me-2" shape="circular" appearance="primary" onClick={seq.playToggle} size="large" icon={seq.isPlaying ? <PauseIcon />:<PlayIcon />} />
                    {/* <Button className="me-2" onClick={()=>{seq.stop(); seq.first()}} icon={<StopIcon />} /> */}
                    <Button className="me-2" onClick={seq.nextMea} icon={<FastForwardIcon />} />
                </span>

                {midi.outPorts.length === 0 ? 
                <Button icon={<MidiIcon />} appearance="primary" onClick={midi.load} />
                :
                <Instrument midi={midi} />
                }

                <label className="ms-2">Program: </label>
                <Select appearance="filled-darker" className="d-inline" value={tracks[tabnum].program}>
                    {programs}
                </Select>
                
                <Singer vox={vox} tracks={tracks} bpm={bpm} />
            </div>

            <div className="row">

                {/* Left Pane */}
                <div className="col-md-6 pe-0 pane">

                    <TrackSelector tracks={tracks} tabnum={tabnum} onAddTrack={onAddTrack} onTabChange={(t)=>setTabnum(t)} onDeleteTab={onDeleteTab} />

                    <div style={{ height: "calc(100% - 42px)" }}>
                        {tracks[tabnum] === undefined ? '' :
                            // <textarea className="form-control editor m-0 bar" value={tracks[tabnum].texts} rows={32} cols={20} onChange={(e) => onTextChange(e.target.value)} wrap="off" />
                            <SMMLEditor value={tracks[tabnum].texts} doChange={onTextChange} />
                        }

                        {/* Left Down Pane */}
                        <textarea
                            style={{ height: "20%" }}
                            className="form-control m-0 overflow-auto"
                            value={log.log}
                            readOnly />
                    </div>

                </div>


                {/* Right Pane */}
                <div className="col-md-6 ps-0 pane">
                    <ul className="nav nav-tabs">
                    {tabNames.map(t=><li className="nav-item" key={t}>
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
                                <PianoRoll notes={tracks[tabnum].notes} seq={seq} />
                                // <NewPianoRoll notes={tracks[tabnum].notes} seq={seq} />
                                :
                                <Disp title={title} bpm={bpm} mea={mea} notes={tracks[tabnum].notes} chords={chords} />
                        :
                        <Variables vars={vars} />
                        }

                        {/* float element */}
                        <div className="fixed-div" style={vox.audioData ? {opacity: 0.7} : {opacity: 0.3} }>
                            {vox.audioData ?
                                <>
                                <audio
                                controls
                                src={vox.audioData ? window.URL.createObjectURL(vox.audioData) : undefined}>
                                </audio>
                                <img src={vox.singers_portrait} alt="singer"/>
                                </>
                            : <></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </FluentProvider>
    )
}
