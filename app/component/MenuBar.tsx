import React, { memo, Dispatch, SetStateAction } from "react"
import { Sequencer, MIDI, VoiceVox, Sound, MenuFunc } from "@/types";
import Link from "next/link";

// fluent ui
import {
    Button, Label, Tooltip, ToolbarButton, ToolbarDivider,
    Menu, MenuTrigger, MenuPopover, MenuList, MenuItem
} from "@fluentui/react-components"

import {
    bundleIcon,
    EditRegular, EditFilled,
    PlayRegular, PlayFilled, PauseRegular, PauseFilled, RewindRegular, RewindFilled, FastForwardRegular, FastForwardFilled,
    SaveRegular, SaveFilled,
    MidiRegular, MidiFilled, SoundWaveCircleRegular, SoundWaveCircleFilled,
    ArrowTrendingTextRegular,
    DocumentRegular, ChatHelpRegular, ChatHelpFilled,
    FolderOpenRegular, FolderOpenFilled,
    SettingsRegular, SettingsFilled,
    InfoRegular, InfoFilled,
    DocumentOnePageSparkleRegular, PersonVoiceRegular, HandshakeRegular,
    LayoutColumnTwoFocusLeftFilled, LayoutColumnTwoFocusRightFilled, LayoutColumnTwoRegular,
    DocumentArrowDownRegular, DocumentArrowDownFilled, DocumentFilled
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
const RewindIcon = bundleIcon(RewindRegular, RewindFilled)
const FastForwardIcon = bundleIcon(FastForwardRegular, FastForwardFilled)

type MenuBarPropsType = {
    f: MenuFunc
    seq: Sequencer
    midi: MIDI
    vox: VoiceVox
    sound: Sound

    bpm: number
    layout: "left" | "normal" | "right"
    setLayout: Dispatch<SetStateAction<"left" | "normal" | "right">>
}

export const MenuBar = memo(function menuBar({ f, seq, midi, bpm, vox, sound, layout, setLayout }: MenuBarPropsType) {

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

    // 再生バー
    const PlayBar = <div className="py-2">
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
    </div>

    // OperationBar
    const SeqBar = <div>
        <Tooltip content="先頭へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.first} icon={<RewindIcon />} />
        </Tooltip>
        <Tooltip content={seq.isPlaying ? "一時停止" : "再生"} relationship="label" positioning="below-start">
            <Button className="mx-2" shape="circular" appearance="primary" onClick={seq.playToggle} size="large" icon={seq.isPlaying ? <PauseIcon /> : <PlayIcon />} />
        </Tooltip>
        <Tooltip content="一小節先へ" relationship="label" positioning="below-start">
            <ToolbarButton onClick={seq.nextMea} icon={<FastForwardIcon />} />
        </Tooltip>
    </div>

    const OperationBar = <div className="py-1">
        <Tooltip content="MIDI機器に接続" relationship="label" positioning="below-start">
            <ToolbarButton appearance={midi.outPorts.length !== 0 ? "primary" : "subtle"} icon={<MidiIcon />} onClick={midi.setup} />
        </Tooltip>
        <Tooltip content="SoundFontに接続" relationship="label" positioning="below-start">
            <ToolbarButton appearance={sound.isLoading !== null ? "primary" : "transparent"} icon={<SoundIcon />} onClick={sound.setup} />
        </Tooltip>
        <Tooltip content="VOICEVOXに接続" relationship="label" positioning="below-start">
            <ToolbarButton icon={<PersonVoiceRegular />} onClick={vox.getSingers} />
        </Tooltip>
    </div>

    const DisplayBar = <div className="py-1">
        <Tooltip content="Toggle Editor" relationship="label" positioning="below-start">
            <ToolbarButton onClick={() => setLayout(layout === "right" ? "normal" : "right")} appearance="subtle" icon={layout === "right" ? <LayoutColumnTwoRegular /> : <LayoutColumnTwoFocusLeftFilled />} />
        </Tooltip>
        <Tooltip content="Toggle Preview" relationship="label" positioning="below-start">
            <ToolbarButton onClick={() => setLayout(layout === "left" ? "normal" : "left")} appearance="subtle" icon={layout === "left" ? <LayoutColumnTwoRegular /> : <LayoutColumnTwoFocusRightFilled />} />
        </Tooltip>
    </div>

    const OtherBar = <div className="py-1">
        <Tooltip content="マニュアル" relationship="label" positioning="below-start">
            <Link href="/about/index" target="_blank"><ToolbarButton icon={<ChatHelpIcon />} /></Link>
        </Tooltip>
        <Tooltip content="ご支援" relationship="label" positioning="below-start">
        <Link href="https://camp-fire.jp/projects/691016/view?utm_campaign=cp_po_share_c_msg_mypage_projects_show" target="_blank"><ToolbarButton icon={<HandshakeRegular />} /></Link>
        </Tooltip>

    </div>

    // console.log("menubar rendered!!!")

    return <div className="d-flex">
        <div className="fs-4 fw-bolder m-1 text-info">Seqhord</div>
        <div className="fs-5 fw-bolder m-2 text-secondary">ver1.0</div>
        <ToolbarDivider className="py-2"/>
        {LeftBar}
        <ToolbarDivider className="py-2"/>
        {OtherBar}
        <ToolbarDivider className="py-2" />
        {PlayBar}
        <ToolbarDivider className="py-2"/>
        {SeqBar}
        <ToolbarDivider className="py-2"/>
        {OperationBar}
        <ToolbarDivider className="py-2"/>
        {DisplayBar}
    </div>
})