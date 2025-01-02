"use client"

// react
import React from "react"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"

// fluent ui
import { FluentProvider, webDarkTheme, SSRProvider } from "@fluentui/react-components"

// types
import { Chord, Scale, Mark, Track, Var2, MenuFunc } from 'types'

// defalut val
import { default_tracks } from "./default_vals/defalut_tracks"

// custom hook
import { useSequencer } from "./hooks/useSequencer"
import { useInstrument } from "./hooks/useInstrument"
import { useVoiceVox } from "./hooks/useVoicevox"
import { useConsole } from "./hooks/useConsole"
import { useSoundFont } from './hooks/useSoundfont'

// component
import { Disp } from './component/display'
import { PianoRoll } from './component/PianoRoll/PianoRoll'
import { TrackSelector } from './component/TrackSelector'
import { SMMLEditor } from './component/SMMLEditor'
import { Singer } from "./component/Singer"
import { PianoBoard } from "./component/PianoBoard/PianoBoard"
import { Variables } from "./component/Variables"
import { MenuBar } from "./component/MenuBar"
import { MarkBar } from "./component/MarkBar"

// script
import { compile } from './compile/compile'
import { generate_midi } from './generate/generate_midi'
import { generate_musicxml } from './generate/generate_musicxml'
import { loadJSON } from './loadJSON'
import { loadMIDI } from './loadMIDI'

import './styles.css'

const simpleDownload = (title: string, url: string) => {
    const a = document.createElement('a')
    a.download = title
    a.href = url
    a.click()
}
const handleBeforeUnload = (e: any) => {
    e.preventDefault()
    e.returnValue = "ページを離れますか？（変更は保存されません）"
}

export default function Main() {
    // State
    const [tracks, setTracks] = useState<Track[]>(default_tracks)
    const [bpm, setBpm] = useState(120)
    const [mea, setMea] = useState(0)
    const [title, setTitle] = useState('none')
    const [chords, setChords] = useState<Chord[]>([])
    const [vars, setVars] = useState<Var2[]>([])
    const [piano, setPiano] = useState(true)
    const [marks, setMarks] = useState<Mark[]>([{tick:0, name: "Setup"}, {tick:8, name:"Start"}])
    const [scales, setScales] = useState<Scale[]>([{tick:0, scale: 'C'}])
    
    const [tabnum, setTabnum] = useState(0)
    const [rightTab, setRightTab] = useState("preview")
    
    const [layout, setLayout] = useState<"left"|"normal"|"right">('normal')

    const [autoCompile, setAutoCompile] = useState(true)
    const [autoFormat, setAutoFormat] = useState(true)
    const [maxTick, setMaxTick] = useState(0)

    const pianoBar = useRef<HTMLDivElement>(null)

    const tabNames = ["preview", "vars"]

    // custom hook
    const midi = useInstrument()
    const sf = useSoundFont()
    const seq = useSequencer(midi, tracks, bpm)
    const vox = useVoiceVox()
    const log = useConsole()
    const timer = useRef<NodeJS.Timeout | null>(null);

    const saveMIDI = useCallback(() => {
        const uri = generate_midi(tracks, bpm)
        simpleDownload(`${title}.mid`, uri)
    },[tracks,title,bpm])

    const saveMusicXML = useCallback(() => {
        const xml = generate_musicxml(0, tracks[0].notes, bpm)
        const blob = new Blob([xml], { type: 'text/plain;charset=utf-8' })
        simpleDownload(`${title}.musicxml`, URL.createObjectURL(blob))
    },[tracks, title, bpm])

    const saveText = useCallback(() => {
        const text = tracks[tabnum].texts
        simpleDownload(`${title}.txt`, 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    },[tracks, title, tabnum])

    const saveAsJson = useCallback(() => {
        simpleDownload(`${title}.smml`, URL.createObjectURL(new Blob([JSON.stringify(tracks)], { type: 'text/json' })))
    },[title, tracks])

    const onNew = useCallback(() => {
        if (confirm('新規作成しますか？（現在のデータは削除されます）')) {
            tracks.forEach(track=>track.texts = "")
            setTracks([...tracks])
        }
        onCompile()
    },[tracks])

    const onTextChange = useCallback((text: string) => {
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
    },[tabnum, tracks, autoCompile, timer.current])

    const setCompile = (tracks: Track[]) => {
        const res = compile(tracks)

        // 値のセット
        // setNotes([...res.notes])
        setTracks([...res.tracks])
        setTitle(res.title)
        log.addLog(res.errMsg)
        setBpm(res.bpm)
        setVars(res.vars)
        setChords(res.chords)
        setMarks(res.marks)
        setScales(res.scales)
    }

    const onCompile = useCallback(() => {
        const res = compile(tracks)

        // 値のセット
        // setNotes([...res.notes])
        setTracks([...res.tracks])
        setTitle(res.title)
        log.addLog(res.errMsg)
        setBpm(res.bpm)
        setVars(res.vars)
        setChords(res.chords)
        setMarks(res.marks)
    },[tracks])

    const onAddTrack = useCallback(() => {
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
    },[tracks])

    const onDeleteTab = useCallback((t: number) => {
        const conf = confirm('トラックを削除しますか？（この操作は取り消しできません）')
        if (!conf) return
        const tmp_tracks = [...tracks]
        tmp_tracks.splice(t, 1)
        setTracks(tmp_tracks)
        setTabnum(0)
    },[tracks])

    const onTabChange = useCallback((t: number)=>{
        setTabnum(t)
    },[])

    const nowScale = () => {
        let sc = "C"
        const found = scales.filter(s=>s.tick<=seq.nowTick)
        if (found.length > 0) {
            sc = found[found.length - 1].scale
        }
        return sc
    }

    const changeProgram = (program: number) => {
        midi.programChange(program, tabnum)
        midi.noteOn(60, tabnum, 1000)

        setTracks(tracks.map((track, i)=>{
            if (i === tabnum) {
                return {...track, program}
            }
            else return track
        }))
    }

    const showOpenFileDialog = useCallback(() => new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json, .smml'
        input.onchange = async () => { 
            resolve((()=>{
                loadJSON(input.files, setTracks, setBpm, setCompile)
            })()) 
        }
        input.click()
    }),[])

    const showMIDIFileDialog = useCallback(() => new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.mid, .midi, .smf'
        input.onchange = async () => { 
            resolve((()=>{
                loadMIDI(input.files, setTracks, setBpm)
            })()) 
        }
        input.click()
    }),[])

    const autoCompose = useCallback(() => {
        log.addLog("auto compose")
    },[])

    const menuFunc:MenuFunc = useMemo(()=>({
        onNew,
        saveMIDI,
        saveMusicXML,
        saveText,
        saveAsJson, 
        showOpenFileDialog, 
        showMIDIFileDialog, 
        onCompile,
        autoCompose
    }),[saveAsJson, showOpenFileDialog, showMIDIFileDialog, onCompile, onNew, saveMIDI, saveMusicXML, saveText, autoCompose])

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

    // LeftPane
    const LeftPane = <div className={"col-md-" + (layout === "left" ? 12 : 6) + " pe-0 pane"} key={"left"}>

        <TrackSelector tracks={tracks} tabnum={tabnum} onAddTrack={onAddTrack} onTabChange={onTabChange} onDeleteTab={onDeleteTab} />

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

    const RightPane = <div className={"col-md-" + (layout === "right" ? 12 : 6) + " ps-0 pane"} key="right">
        <ul className="nav nav-tabs">
        {tabNames.map(t=><li className="nav-item" key={t}>
            <a className={"pointer nav-link" + (t === rightTab ? " active" : "")} onClick={()=>setRightTab(t)}>
                {t}
            </a>
            </li>
        )}
        </ul>

        <div>
                {/* PianoRoll, info, etc... */}
                <div className="reverse-wrapper bar" ref={pianoBar}>
                <div className="reverse-content">

                {rightTab === "preview" ?
                tracks[tabnum] === undefined || tracks[tabnum].notes === undefined ?
                    '' :
                    piano ?
                        <PianoRoll notes={tracks[tabnum].notes} seq={seq} chords={chords} pianoBar={pianoBar?.current}/>
                        // <NewPianoRoll notes={tracks[tabnum].notes} seq={seq} />
                        :
                        <Disp title={title} bpm={bpm} mea={mea} notes={tracks[tabnum].notes} chords={chords} />
                :
                <Variables vars={vars} />
                }
                </div>
                </div>


                {/* float element */}
                <div className="fixed-div">               
                    <Singer vox={vox} tracks={tracks} bpm={bpm} />
                </div>

                {/* <div className="fixed-div2">
                    <PianoBoard sf={sf} />
                    <div>
                        {midi.outPorts.length !== 0 && <Instrument midi={midi} />}
                        <Select appearance="filled-darker" className="d-inline" value={tracks[tabnum].program}>
                            {programs}
                        </Select>
                    </div>
                </div> */}
            </div>
    </div>

    let MainPane = [LeftPane, RightPane]
    if (layout === 'left') MainPane = [LeftPane]
    if (layout === 'right') MainPane = [RightPane]

    // console.log("page rendered!!!")

    return (
        <FluentProvider theme={webDarkTheme}>
        <SSRProvider>
        <div className="container-fluid" data-bs-theme="dark">
            <MenuBar f={menuFunc} seq={seq} midi={midi} vox={vox} scale={nowScale()} sound={sf} bpm={bpm} layout={layout} setLayout={setLayout} track={tracks[tabnum]} changeProgram={changeProgram} />
            <MarkBar marks={marks} seq={seq}/>
            <div className="row">
                {MainPane}
            </div>

        </div>
        </SSRProvider>
        </FluentProvider>
    )
}
