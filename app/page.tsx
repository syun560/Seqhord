"use client"

// react
import React from "react"
import { useState, useEffect, useRef } from "react"

// fluent ui
import {
    FluentProvider,
    webLightTheme, webDarkTheme,
    Menu, MenuTrigger, MenuList, MenuItem, MenuItemLink, MenuPopover, MenuDivider,
    Toolbar,ToolbarButton,
    Button,
    Select,
} from "@fluentui/react-components"

import {
    bundleIcon,
    ArrowUndoRegular,
    CutRegular, CutFilled,
    ClipboardPasteRegular, ClipboardPasteFilled,
    EditRegular, EditFilled,
    PlayRegular, PlayFilled, PauseRegular, PauseFilled, RewindRegular, RewindFilled,
    SaveRegular, SaveFilled,
    ZoomInRegular, ZoomInFilled, ZoomOutRegular, ZoomOutFilled,
    MidiRegular, MidiFilled, PersonVoiceRegular, PersonVoiceFilled,
    DocumentRegular
} from "@fluentui/react-icons"

const CutIcon = bundleIcon(CutFilled, CutRegular);
const PasteIcon = bundleIcon(ClipboardPasteFilled, ClipboardPasteRegular);
const EditIcon = bundleIcon(EditFilled, EditRegular);
const PlayIcon = bundleIcon(PlayRegular, PlayFilled)
const PauseIcon = bundleIcon(PauseRegular, PauseFilled)
const RewindIcon = bundleIcon(RewindRegular, RewindFilled)
const SaveIcon = bundleIcon(SaveRegular, SaveFilled)
const MidiIcon = bundleIcon(MidiRegular, MidiFilled)
const PersonVoiceIcon = bundleIcon(PersonVoiceRegular, PersonVoiceFilled)

// types
import { Chord, Track } from 'types'

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
import { Singer } from "./component/Singer"

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
import { loadJSON } from './loadJSON'
import Lib from './Lib'

import './globals.css'

const default_tracks: Track[] = [
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

const programName = Lib.programName.map((p, i)=><option key={i}>{i}: {p}</option>)

export default function Main() {
    // useState
    const [tracks, setTracks] = useState<Track[]>(default_tracks)
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

    // const tabNames = ["preview", "info"]
    const tabNames = ["preview"]

    // custom hook
    const midi = useInstrument()
    const seq = useSequencer(midi, tracks, bpm)
    const vox = useVoiceVox()
    const timer = useRef<NodeJS.Timeout | null>(null);

    const saveMIDI = () => {
        const uri = generate_midi(tracks, bpm)
        const a = document.createElement('a')
        a.download = `${title}.mid`
        a.href = uri
        a.click()
    }
    const saveMusicXML = () => {
        const xml = generate_musicxml(0, tracks[0].notes, bpm)
        const blob = new Blob([xml], {
            type: 'text/plain;charset=utf-8',
        });
        const a = document.createElement('a')
        a.download = `${title}.musicxml`
        a.href = URL.createObjectURL(blob)
        a.click()
    }

    const saveText = () => {
        const text = ""
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
        let result = confirm('新規作成しますか？（現在のデータは削除されます）')
        if (result) {
            tracks.forEach(track=>track.texts = "")
            setTracks([...tracks])
        }
        onCompile()
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

    const showOpenFileDialog = () => new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json, .smml'
        input.onchange = () => { resolve(loadJSON(input.files, setTracks)) }
        input.click()
    })

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload)
        onCompile()
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    return (
        <FluentProvider theme={webDarkTheme}>

        <div className="container-fluid">
            <div className="ctr-pane" >
                {/* <Ala /> */}
                <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <ToolbarButton>ファイル</ToolbarButton>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            <MenuItem icon={<DocumentRegular />}secondaryContent="Ctrl+N" onClick={onNew}>新規作成</MenuItem>
                            <MenuItem icon={<SaveIcon />} secondaryContent="Ctrl+S" onClick={onJson}>プロジェクトを保存する</MenuItem>
                            <MenuItem secondaryContent="Ctrl+O" onClick={showOpenFileDialog}>プロジェクトを開く</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={saveMIDI}>MIDIで書き出す</MenuItem>
                            <MenuItem onClick={saveMusicXML}>musicXMLで書き出す</MenuItem>
                            <MenuItem onClick={saveText}>現在のトラックのテキストを書き出す</MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <ToolbarButton>編集</ToolbarButton>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            <MenuItem secondaryContent="Ctrl+Z" icon={<CutIcon />}>元に戻す</MenuItem>
                            <MenuItem secondaryContent="Ctrl+Y"icon={<PasteIcon />}>やり直す</MenuItem>
                            <MenuItem icon={<EditIcon />}onClick={onFormat}>文字列をフォーマットする</MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <ToolbarButton>表示</ToolbarButton>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            <MenuItem icon={<ZoomInRegular />}>拡大</MenuItem>
                            <MenuItem icon={<ZoomOutRegular />}>縮小</MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <ToolbarButton>再生</ToolbarButton>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            <MenuItem icon={<PlayIcon />} secondaryContent="Space" onClick={seq.playToggle}>再生</MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <ToolbarButton>ヘルプ</ToolbarButton>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            <MenuItemLink href="https://www.google.com" target="none">公式マニュアル</MenuItemLink>
                        </MenuList>
                    </MenuPopover>
                </Menu>

                {midi.outPorts.length === 0 ? 
                <Button icon={<MidiIcon />} onClick={midi.load} />
                :
                <Instrument midi={midi} />
                }

                <span>
                    <Button className="me-2" onClick={seq.first} icon={<RewindIcon />} />
                    <Button className="me-2" appearance="primary" onClick={seq.playToggle} size="large" icon={seq.isPlaying ? <PauseIcon />:<PlayIcon />} />
                    <span className="me-2">{seq.nowTick}/300</span>
                    <span className="me-2">Beat: 4/4</span>
                    <span className="me-2">Tempo: {bpm}</span>
                    <span className="me-2">Key: G</span>
                </span>

                <Select className="d-inline">
                    {programName}
                </Select>
                
                <Singer vox={vox} tracks={tracks} bpm={bpm} />
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
                                <LegPianoRoll notes={tracks[tabnum].notes} seq={seq} />
                                // <NewPianoRoll notes={tracks[tabnum].notes} seq={seq} />
                                :
                                <Disp title={title} bpm={bpm} mea={mea} notes={tracks[tabnum].notes} chords={chords} />
                        :
                        <div>info</div>
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
