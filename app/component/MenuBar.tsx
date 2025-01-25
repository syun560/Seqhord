import React, { memo, useState, Dispatch, SetStateAction } from "react"
import { MIDI, VoiceVox, MenuFunc, Track } from "@/types";
import { Instrument } from "./Instrument"
import { FirstDialog } from "./FirstDialog"
import Lib from '../Lib'
import Link from "next/link";

// fluent ui
import {
    Select, Tooltip, ToolbarButton, ToolbarDivider,
    Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Slider,
    useId,
    SliderProps
} from "@fluentui/react-components"

import {
    bundleIcon,
    SaveRegular, SaveFilled,
    MidiRegular, MidiFilled,
    ArrowCircleDownRegular, ArrowCircleDownFilled, ArrowCircleRightRegular, ArrowCircleRightFilled,
    ArrowCircleUpRegular, ArrowCircleUpFilled,
    DocumentRegular, ChatHelpRegular, ChatHelpFilled,
    FullScreenMaximizeFilled, FullScreenMaximizeRegular, FullScreenMinimizeRegular, FullScreenMinimizeFilled,
    FolderOpenRegular, FolderOpenFilled,
    SettingsRegular, SettingsFilled,
    DocumentOnePageSparkleRegular, DocumentOnePageSparkleFilled,
    LayoutColumnTwoFocusLeftFilled, LayoutColumnTwoFocusRightFilled, LayoutColumnTwoRegular,
    DocumentFilled,
} from "@fluentui/react-icons"
import { setRequestMeta } from "next/dist/server/request-meta";

const SaveIcon = bundleIcon(SaveRegular, SaveFilled)
const MidiIcon = bundleIcon(MidiRegular, MidiFilled)
const ChatHelpIcon = bundleIcon(ChatHelpRegular, ChatHelpFilled)
const FolderOpenIcon = bundleIcon(FolderOpenRegular, FolderOpenFilled)
const NewIcon = bundleIcon(DocumentRegular, DocumentFilled)
const DownloadIcon = bundleIcon(ArrowCircleDownRegular, ArrowCircleDownFilled)
const UploadIcon = bundleIcon(ArrowCircleUpRegular, ArrowCircleUpFilled)
const SettingIcon = bundleIcon(SettingsRegular, SettingsFilled)
const MaximizeIcon = bundleIcon(FullScreenMaximizeRegular, FullScreenMaximizeFilled)
const MinimizeIcon = bundleIcon(FullScreenMinimizeRegular, FullScreenMinimizeFilled)
const FormatIcon = bundleIcon(DocumentOnePageSparkleRegular, DocumentOnePageSparkleFilled)
const CompileIcon = bundleIcon(ArrowCircleRightRegular, ArrowCircleRightFilled)

type MenuBarPropsType = {
    f: MenuFunc
    midi: MIDI
    vox: VoiceVox
    track: Track
    changeProgram: (program: number) => void

    layout: "left" | "normal" | "right"
    setLayout: Dispatch<SetStateAction<"left" | "normal" | "right">>
}

const programs = Lib.programName.map((p, i)=><option key={i} value={i}>{String(i).padStart(3, '0')}: {p}</option>)

export const MenuBar = memo(function MenuBar({ f, midi, vox, track, changeProgram, layout, setLayout }: MenuBarPropsType) {

    const [screen, setScreen] = useState<'normal'|'maximum'>('normal')
    const maximizeScreen = () => {
        document.body.requestFullscreen()
        setScreen('maximum')
    }
    const minimizeScreen = () => {
        document.exitFullscreen()
        setScreen('normal')
    }

    const id = useId()
    const [sliderValue, setSliderValue] = React.useState(160);
    const onSliderChange: SliderProps["onChange"] = (_, data) => {
        setSliderValue(data.value)
        midi.masterVolume.current = data.value
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
        <Tooltip content="MIDIをインポート" relationship="label" positioning="below-start">
            <ToolbarButton onClick={f.saveAsJson} icon={<UploadIcon />} />
        </Tooltip>
        <Menu>
            <MenuTrigger>
                <Tooltip content="エクスポート" relationship="label" positioning="below-start">
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

    const OperationBar = <div className="py-1 d-none d-lg-block">
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

    const DisplayBar = <div className="py-1 d-none d-lg-block">
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

    const OtherBar = <div className="py-1 d-none d-lg-block">
        <Tooltip content="フォーマットする" relationship="label" positioning="below-start">
            <ToolbarButton onClick={f.formatText} icon={<FormatIcon />} />
        </Tooltip>
        <Tooltip content="コンパイル" relationship="label" positioning="below-start">
            {/* <ToolbarButton onClick={f.onCompile} icon={<DocumentOnePageSparkleRegular />}>コンパイル</ToolbarButton> */}
            <ToolbarButton onClick={f.onCompile} icon={<CompileIcon />} />
        </Tooltip>
        <Tooltip content="マニュアル（別タブで開きます）" relationship="label" positioning="below-start">
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


    const instBar = <div className="py-1 d-none d-sm-block">
    {midi.outPorts.length !== 0 && <Instrument midi={midi} />}
    <Select appearance="filled-darker" className="d-inline" value={track.program} onChange={(e)=>changeProgram(Number(e.target.value))} >
        {programs}
    </Select>
    </div>

    return <div className="d-flex" style={{background: "#00203b"}}>
        <FirstDialog />
        {/* <div className="fs-5 fw-bolder m-2 text-secondary">ver1.0</div> */}
        {LeftBar}
        {OtherBar}
        {DisplayBar}
        {OperationBar}
        {instBar}
        <div className="py-1 d-none d-sm-block">
            <Slider value={sliderValue} min={0} max={100} onChange={onSliderChange} id={id} />
        </div>
    </div>
})