import React, { memo, useState, Dispatch, SetStateAction } from "react"
import { Sequencer, MIDI, VoiceVox, Sound, MenuFunc, Track, Scale } from "@/types";
import { Instrument } from "./Instrument"
import { FirstDialog } from "./FirstDialog"
import Lib from '../Lib'

import Link from "next/link";

// fluent ui
import {
    Button, Select, Label, Tooltip, ToolbarButton, ToolbarDivider,
    Menu, MenuTrigger, MenuPopover, MenuList, MenuItem,
} from "@fluentui/react-components"

import {
    bundleIcon,
    PlayRegular, PlayFilled, PauseRegular, PauseFilled,
    SaveRegular, SaveFilled,
    MidiRegular, MidiFilled, SoundWaveCircleRegular, SoundWaveCircleFilled,
    ArrowTrendingTextRegular,
    DocumentRegular, ChatHelpRegular, ChatHelpFilled,
    FullScreenMaximizeFilled, FullScreenMaximizeRegular, FullScreenMinimizeRegular, FullScreenMinimizeFilled,
    FolderOpenRegular, FolderOpenFilled,
    SettingsRegular, SettingsFilled,
    InfoRegular, InfoFilled,
    DocumentOnePageSparkleRegular, DocumentOnePageSparkleFilled, PersonVoiceRegular, HandshakeRegular,
    LayoutColumnTwoFocusLeftFilled, LayoutColumnTwoFocusRightFilled, LayoutColumnTwoRegular,
    DocumentArrowDownRegular, DocumentArrowDownFilled, DocumentFilled,
    ChevronDoubleLeftFilled, ChevronDoubleLeftRegular, ChevronDoubleRightFilled, ChevronDoubleRightRegular,
    ChevronRightFilled, ChevronRightRegular, ChevronLeftFilled, ChevronLeftRegular, 
} from "@fluentui/react-icons"

const PlayIcon = bundleIcon(PlayRegular, PlayFilled)
const SaveIcon = bundleIcon(SaveRegular, SaveFilled)
const MidiIcon = bundleIcon(MidiRegular, MidiFilled)
const SoundIcon = bundleIcon(SoundWaveCircleRegular, SoundWaveCircleFilled)
const ChatHelpIcon = bundleIcon(ChatHelpRegular, ChatHelpFilled)
const FolderOpenIcon = bundleIcon(FolderOpenRegular, FolderOpenFilled)
const NewIcon = bundleIcon(DocumentRegular, DocumentFilled)
const DownloadIcon = bundleIcon(DocumentArrowDownRegular, DocumentArrowDownFilled)
const SettingIcon = bundleIcon(SettingsRegular, SettingsFilled)
const InfoIcon = bundleIcon(InfoRegular, InfoFilled)
const PauseIcon = bundleIcon(PauseRegular, PauseFilled)
const RewindIcon = bundleIcon(ChevronDoubleLeftRegular, ChevronDoubleLeftFilled)
const LastIcon = bundleIcon(ChevronDoubleRightRegular, ChevronDoubleRightFilled)
const FastForwardIcon = bundleIcon(ChevronRightRegular, ChevronRightFilled)
const PrevIcon = bundleIcon(ChevronLeftRegular, ChevronLeftFilled)
const MaximizeIcon = bundleIcon(FullScreenMaximizeRegular, FullScreenMaximizeFilled)
const MinimizeIcon = bundleIcon(FullScreenMinimizeRegular, FullScreenMinimizeFilled)
const CompileIcon = bundleIcon(DocumentOnePageSparkleRegular, DocumentOnePageSparkleFilled)

type MenuBarPropsType = {
    f: MenuFunc
    seq: Sequencer
    midi: MIDI
    vox: VoiceVox
    sound: Sound
    track: Track
    scale: string
    changeProgram: (program: number) => void

    bpm: number
    layout: "left" | "normal" | "right"
    setLayout: Dispatch<SetStateAction<"left" | "normal" | "right">>
}

const programs = Lib.programName.map((p, i)=><option key={i} value={i}>{String(i).padStart(3, '0')}: {p}</option>)

export const MenuBar = memo(function MenuBar({ f, seq, midi, bpm, vox, sound, scale, track, changeProgram, layout, setLayout }: MenuBarPropsType) {

    const [screen, setScreen] = useState<'normal'|'maximum'>('normal')
    const maximizeScreen = () => {
        document.body.requestFullscreen()
        setScreen('maximum')
    }
    const minimizeScreen = () => {
        document.exitFullscreen()
        setScreen('normal')
    }

    // ファイル操作
    const LeftBar = <div className="py-1">
        <Tooltip content="新規" relationship="label" positioning="below-start">
            <ToolbarButton onClick={f.onNew} icon={<NewIcon />} />
        </Tooltip>
        <Tooltip content="開く" relationship="label" positioning="below-start">
            <ToolbarButton onClick={f.showOpenFileDialog} icon={<FolderOpenIcon />} />
        </Tooltip>
        <Tooltip content="保存する" relationship="label" positioning="below-start">
            <ToolbarButton onClick={f.saveAsJson} icon={<SaveIcon />} />
        </Tooltip>
        <Menu>
            <MenuTrigger>
                <Tooltip content="書き出す" relationship="label" positioning="below-start">
                    <ToolbarButton icon={<DownloadIcon />} />
                </Tooltip>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={f.saveMIDI}>MIDIで書き出す</MenuItem>
                    <MenuItem onClick={f.saveMusicXML}>musicXMLで書き出す</MenuItem>
                    <MenuItem onClick={f.saveText}>テキストを書き出す</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    </div>

    // コンダクトバー
    const ConductBar = <div className="p-2" style={{background: "#5c590a"}}>
        <span className="me-2">
            Tick: <Label size="large" style={{ fontFamily: "monospace" }}>
                {String(Math.floor(seq.nowTick / 8)).padStart(3, '\xa0')}:{String((seq.nowTick % 8).toFixed(1)).padStart(2, '0')}
            </Label>
        </span>
        <span className="me-2">
            Beat: <Label size="large" style={{ fontFamily: "monospace" }}>4/4</Label>
        </span>
        <span className="me-2">
            Tempo: <Label size="large" style={{ fontFamily: "monospace" }}>{bpm}</Label>
        </span>
        <span>
            Key: <Label size="large" style={{ fontFamily: "monospace" }}>{scale}</Label>
        </span>
    </div>

    // OperationBar
    const SeqBar = <div>
        <Tooltip content="先頭へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.first} icon={<RewindIcon />} />
        </Tooltip>
        <Tooltip content="一小節前へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.prevMea} icon={<PrevIcon />} />
        </Tooltip>
        <Tooltip content={seq.isPlaying ? "一時停止" : "再生"} relationship="label" positioning="below-start">
            <Button className="mx-2" shape="circular" appearance="primary" onClick={seq.playToggle} size="large" icon={seq.isPlaying ? <PauseIcon /> : <PlayIcon />} />
        </Tooltip>
        <Tooltip content="一小節先へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.nextMea} icon={<FastForwardIcon />} />
        </Tooltip>
        <Tooltip content="最後尾へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.last} icon={<LastIcon />} />
        </Tooltip>
    </div>

    const OperationBar = <div className="py-1">
        <Tooltip content="MIDI機器に接続" relationship="label" positioning="below-start">
            <ToolbarButton appearance={midi.outPorts.length !== 0 ? "primary" : "subtle"} icon={<MidiIcon />} onClick={midi.setup} />
        </Tooltip>
        {/* <Tooltip content="SoundFontに接続" relationship="label" positioning="below-start">
            <ToolbarButton appearance={sound.isLoading !== null ? "primary" : "transparent"} icon={<SoundIcon />} onClick={sound.setup} />
        </Tooltip> */}
        <Tooltip content="VOICEVOXに接続" relationship="label" positioning="below-start">
            {/* <ToolbarButton icon={<PersonVoiceRegular />} onClick={vox.getSingers} /> */}
            <button onClick={vox.getSingers} className="btn btn-sm"><img src='/images/vvIcon.png' height="22px" /></button>
        </Tooltip>
        <Tooltip content="VOICEVOX設定" relationship="label" positioning="below-start">
            <Link href="http://localhost:50021/setting" target="_blank"><ToolbarButton icon={<SettingIcon />} /></Link>
        </Tooltip>
    </div>

    const DisplayBar = <div className="py-1">
        <Tooltip content="Toggle Editor" relationship="label" positioning="below-start">
            <ToolbarButton onClick={() => setLayout(layout === "right" ? "normal" : "right")} appearance="subtle" icon={layout === "right" ? <LayoutColumnTwoRegular /> : <LayoutColumnTwoFocusLeftFilled />} />
        </Tooltip>
        <Tooltip content="Toggle Preview" relationship="label" positioning="below-start">
            <ToolbarButton onClick={() => setLayout(layout === "left" ? "normal" : "left")} appearance="subtle" icon={layout === "left" ? <LayoutColumnTwoRegular /> : <LayoutColumnTwoFocusRightFilled />} />
        </Tooltip>
        {screen === 'normal' ? <Tooltip content="画面を最大化(F11)" relationship="label" positioning="below-start">
            <ToolbarButton onClick={maximizeScreen} icon={<MaximizeIcon />} />
        </Tooltip>
        :<Tooltip content="全画面表示を終了" relationship="label" positioning="below-start">
            <ToolbarButton onClick={minimizeScreen} icon={<MinimizeIcon />} />
        </Tooltip>}
        
    </div>

    const OtherBar = <div className="py-1">
        <Tooltip content="コンパイル" relationship="label" positioning="below-start">
            {/* <ToolbarButton onClick={f.onCompile} icon={<DocumentOnePageSparkleRegular />}>コンパイル</ToolbarButton> */}
            <ToolbarButton onClick={f.onCompile} icon={<CompileIcon />} />
        </Tooltip>
        <Tooltip content="マニュアル" relationship="label" positioning="below-start">
            <Link href="/about/index" target="_blank"><ToolbarButton icon={<ChatHelpIcon />} /></Link>
        </Tooltip>
        {/* <Tooltip content="ご支援" relationship="label" positioning="below-start">
            <Link href="https://camp-fire.jp/projects/691016/view?utm_campaign=cp_po_share_c_msg_mypage_projects_show" target="_blank"><ToolbarButton icon={<HandshakeRegular />} /></Link>
        </Tooltip> */}
        {/* <Tooltip content="Xで共有" relationship="label" positioning="below-start">
            <Link href="https://twitter.com/intent/tweet?text=Sechord%E3%82%92%E4%BD%BF%E3%81%86%EF%BC%81%0Ahttps%3A%2F%2Fsechord.com%0A" target="_blank">
                <button className="btn btn-sm"><img src='/images/x.png' height="16px" /></button>
            </Link>
        </Tooltip> */}
    </div>

    // console.log("menubar rendered!!!")


    const instBar = <div className="py-1">
    {midi.outPorts.length !== 0 && <Instrument midi={midi} />}
    <Select appearance="filled-darker" className="d-inline" value={track.program} onChange={(e)=>changeProgram(Number(e.target.value))} >
        {programs}
    </Select>
    </div>

    return <div className="d-flex">
        <FirstDialog />
        {/* <div className="fs-5 fw-bolder m-2 text-secondary">ver1.0</div> */}
        <ToolbarDivider className="py-2"/>
        {LeftBar}
        {/* <ToolbarDivider className="py-2"/> */}
        {OtherBar}
        <ToolbarDivider className="py-2"/>
        {DisplayBar}
        <ToolbarDivider className="py-2"/>
        {ConductBar}
        <ToolbarDivider className="py-2"/>
        {SeqBar}
        <ToolbarDivider className="py-2"/>
        {OperationBar}
        <ToolbarDivider className="py-2"/>
        {instBar}
    </div>
})