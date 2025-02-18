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
import { useMIDI } from "./hooks/useMIDI"
import { useVoiceVox } from "./hooks/useVoicevox"
import { useConsole } from "./hooks/useConsole"
import { useSoundFont } from './hooks/useSoundfont'
import { useAudio } from './hooks/useAudio'


// component
import { PianoRoll } from './component/PianoRoll/PianoRoll'
import { TrackSelector } from './component/TrackSelector'
import { SMMLEditor } from './component/SMMLEditor'
import { Singer } from "./component/Singer"
import { PianoBoard } from "./component/PianoBoard/PianoBoard"
import { Variables } from "./component/Variables"
import { Mixer } from "./component/Mixer"
import { MenuBar } from "./component/MenuBar"
import { MenuBar2 } from "./component/MenuBar2"
import { Songs } from "./component/Songs"

// script
import { compile } from './compile/compile'
import { format_text } from "./compile/format_text"
import { generate_midi } from './generate/generate_midi'
import { generate_musicxml } from './generate/generate_musicxml'
import { loadText } from './utils/loadText'
import { loadMIDI } from './utils/loadMIDI'

import './styles.css'
import { savelocal } from "./utils/savelocal"

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

type LeftTabType = "Code" | "Tracks"
type RightTabType = "Preview" | "Vars"

export default function Main() {
    // State
    const [tracks, setTracks] = useState<Track[]>(default_tracks)
    const [bpm, setBpm] = useState(120)
    const [title, setTitle] = useState('none')
    const [chords, setChords] = useState<Chord[]>([])
    const [vars, setVars] = useState<Var2[]>([])
    const [marks, setMarks] = useState<Mark[]>([{ tick: 0, name: "Setup" }])
    const [scales, setScales] = useState<Scale[]>([{ tick: 0, scale: 'C' }])

    const [nowTrack, setNowTrack] = useState(0)
    const [leftTab, setLeftTab] = useState<LeftTabType>("Code")
    const [rightTab, setRightTab] = useState<RightTabType>("Preview")

    const [layout, setLayout] = useState<"left" | "normal" | "right">('normal')

    const [autoCompile, setAutoCompile] = useState(true)
    const [autoFormat, setAutoFormat] = useState(true)

    const audioRef = useRef<HTMLAudioElement>(null)
    const pianoBar = useRef<HTMLDivElement>(null)

    const rightTabNames: RightTabType[] = ["Preview", "Vars"]
    const leftTabNames: LeftTabType[] = ["Code", "Tracks"]

    // custom hook
    const midi = useMIDI()
    const sf = useSoundFont()
    const audio = useAudio()
    const seq = useSequencer(midi, tracks, bpm, audio)
    const vox = useVoiceVox()
    const log = useConsole()
    const timer = useRef<NodeJS.Timeout | null>(null);

    const saveMIDI = useCallback(() => {
        const uri = generate_midi(tracks, bpm, marks)
        simpleDownload(`${title}.mid`, uri)
    }, [tracks, title, bpm, marks])

    const saveMusicXML = useCallback(() => {
        const xml = generate_musicxml(0, tracks[0].notes, bpm)
        const blob = new Blob([xml], { type: 'text/plain;charset=utf-8' })
        simpleDownload(`${title}.musicxml`, URL.createObjectURL(blob))
    }, [tracks, title, bpm])

    const saveText = useCallback(() => {
        // 複数トラックのテキストを一つのテキストにする。
        const text = tracks.map(t => t.texts).join("\n@end\n")
        simpleDownload(`${title}.txt`, 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    }, [tracks, title])

    const formatText = useCallback(() => {
        const formatted = format_text(tracks[nowTrack].texts)
        setTracks(trks => trks.map((trk, ch) => {
            if (ch === ch) return { ...trk, texts: formatted }
            else return trk
        }))
    }, [tracks, nowTrack])

    const setCompile = async (texts: string[]) => {
        const res = compile(texts)

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

        // 音声合成
        if(!vox.creating) {
            log.addLog("voice synth start...")
            const msg = await vox.synthVoice(res.tracks[0].notes, res.bpm)
            log.addLog(msg)
        }
    }

    const onTextChange = useCallback((text: string) => {
        // setTexts(texts.map((t, i) => (i === tabnum ? text : t)))
        const tk = [...tracks]
        tk[nowTrack].texts = text
        setTracks(tk)

        // 3秒間編集されなかったら自動でコンパイルする
        if (autoCompile) {
            if (timer.current) { clearTimeout(timer.current); }
            timer.current = setTimeout(() => {
                setCompile(tracks.map(t=>t.texts))
            }, 3000)
        }
    }, [nowTrack, tracks, autoCompile, timer.current])

    const onNew = useCallback(() => {
        if (confirm('新規作成しますか？（現在のデータは削除されます）')) {
            tracks.forEach(track => track.texts = "")
            setTracks([...tracks])
        }
        setCompile(tracks.map(t=>t.texts))
    }, [tracks])

    const nowScale = () => {
        let sc = "C"
        const found = scales.filter(s => s.tick <= seq.nowTick)
        if (found.length > 0) {
            sc = found[found.length - 1].scale
        }
        return sc
    }

    // 楽器を変えた時
    // + プレビューで音を鳴らす（再生していないときのみ）
    // + Codeの記述も変える
    const changeProgram = (program: number) => {
        midi.programChange(program, nowTrack)

        if (!seq.isPlaying) {
            midi.noteOn(60, tracks[nowTrack].ch, 1000)
        }

        setTracks(tracks => tracks.map((track, i) => {
            if (i === nowTrack) {
                const texts = track.texts.split('\n').map(line=>{
                    if (line.includes("@program")) return `@program = ${program}`
                    else return line
                }).join('\n')
                return { ...track, program, texts }
            }
            else return track
        }))
    }

    // テキストファイルを読み込む
    const showOpenFileDialog = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt'
        input.onchange = async () => {
            seq.stop()
            seq.first()
            setNowTrack(0)
            try {
                const texts = await loadText(input.files) as string
                setCompile(texts.split(/\r?\n@end\r?\n/)) // LFとCRLFの両方の改行コードに対応
            }
            catch (error) {
                console.error(error)
            }
        }
        input.click()
    }, [seq, setCompile])

    const showMIDIFileDialog = useCallback(() => new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.mid, .midi, .smf'
        input.onchange = async () => {
            resolve((() => {
                loadMIDI(input.files, setTracks, setBpm)
            })())
        }
        input.click()
    }), [])

    const autoCompose = useCallback(() => {
        log.addLog("auto compose")
    }, [log])

    const importMIDI = useCallback(() => {

    }, [])

    const menuFunc: MenuFunc = useMemo(() => ({
        onNew,
        saveMIDI,
        saveMusicXML,
        saveText,
        showOpenFileDialog,
        showMIDIFileDialog,
        importMIDI,
        setCompile,
        formatText,
        autoCompose
    }), [showOpenFileDialog, showMIDIFileDialog, importMIDI, setCompile, onNew, formatText, saveMIDI, saveMusicXML, saveText, autoCompose])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload)
        setCompile(tracks.map(t=>t.texts))
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    const LeftTab = {
        "Code": <div style={{ height: "calc(100% - 42px)" }}>
            {tracks[nowTrack] === undefined ? '' :
                // <textarea className="form-control editor m-0 bar" value={tracks[tabnum].texts} rows={32} cols={20} onChange={(e) => onTextChange(e.target.value)} wrap="off" />
                <SMMLEditor value={tracks[nowTrack].texts} doChange={onTextChange} />
            }

            {/* Left Down Pane */}
            <textarea
                style={{ height: "20%" }}
                className="form-control m-0 overflow-auto"
                value={log.log}
                readOnly />
        </div>,
        // "Songs": <Songs tracks={tracks} title={title} />,
        "Tracks": <Mixer tracks={tracks} setTracks={setTracks} nowTrack={nowTrack} setNowTrack={setNowTrack} midi={midi}/>
    }

    // LeftPane
    const LeftPane = <div className={"col-md-" + (layout === "left" ? 12 : 6) + " pe-0 pane"} key={"left"}>

        <ul className="nav nav-tabs">
            {leftTabNames.map(t => <li className="nav-item" key={t}>
                <a className={"pointer nav-link" + (t === leftTab ? " active" : "")} onClick={() => setLeftTab(t)}>
                    {t}
                </a>
            </li>
            )}
        </ul>

        {LeftTab[leftTab]}

    </div>

    const RightTab = {
        "Preview": <div className="reverse-wrapper bar" ref={pianoBar}>
            <div className="reverse-content">
                {(tracks[nowTrack] === undefined || tracks[nowTrack].notes === undefined) ? <></> :
                <PianoRoll tracks={tracks} nowTrack={nowTrack} seq={seq} chords={chords} pianoBar={pianoBar?.current} />}
            </div>
        </div>,
        "Vars": <div className="overflow-scroll">
            <Variables vars={vars} />
        </div>
    }

    const RightPane = <div className={"col-md-" + (layout === "right" ? 12 : 6) + " ps-0 pane"} key="right">
        <ul className="nav nav-tabs">
            {rightTabNames.map(t => <li className="nav-item" key={t}>
                <a className={"pointer nav-link" + (t === rightTab ? " active" : "")} onClick={() => setRightTab(t)}>
                    {t}
                </a>
            </li>
            )}
        </ul>

        <div>
            {/* PianoRoll, Vars, etc... */}
            {RightTab[rightTab]}

            {/* float element */}
            <div className={vox.creating ? "fixed-div opa_disabled" : "fixed-div opa" }>
                {vox.singers_portrait !== "" &&
                    <img height="88%" src={vox.singers_portrait} alt="singer" />
                }
            </div>
            <div className="fixed-div2">
                <PianoBoard sf={sf} midi={midi} ch={tracks[nowTrack].ch} scale={nowScale()} />
            </div>

        </div>
    </div>

    let MainPane = [LeftPane, RightPane]
    if (layout === 'left') MainPane = [LeftPane]
    if (layout === 'right') MainPane = [RightPane]

    return (
        <FluentProvider theme={webDarkTheme}>
            <SSRProvider>
                <div className="container-fluid overflow-hidden p-0" data-bs-theme="dark">

                    <div className="d-flex align-items-center" style={{ background: "#00203b" }}>
                        <MenuBar f={menuFunc} tracks={tracks} midi={midi} vox={vox} bpm={bpm} layout={layout} setLayout={setLayout} />
                        <Singer vox={vox} tracks={tracks} bpm={bpm} audio={audio} />
                    </div>

                    <div className="d-flex align-items-center" style={{ background: "#10203b" }}>
                        <TrackSelector tracks={tracks} nowTrack={nowTrack} setNowTrack={setNowTrack} />
                        <MenuBar2 tracks={tracks} setTracks={setTracks} midi={midi} seq={seq} scale={nowScale()} bpm={bpm} marks={marks} nowTrack={nowTrack} changeProgram={changeProgram} />
                    </div>

                    <div className="row">
                        {MainPane}
                    </div>
                </div>
            </SSRProvider>
        </FluentProvider>
    )
}
