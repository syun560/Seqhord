import React, { memo } from "react"

// fluent ui
import {
    Menu, MenuTrigger, MenuList, MenuItem, MenuItemLink, MenuPopover, MenuDivider,
    ToolbarButton,
} from "@fluentui/react-components"

import {
    bundleIcon,
    CutRegular, CutFilled,
    ClipboardPasteRegular, ClipboardPasteFilled,
    EditRegular, EditFilled,
    PlayRegular, PlayFilled, PauseRegular, PauseFilled, RewindRegular, RewindFilled, FastForwardRegular, FastForwardFilled,
    SaveRegular, SaveFilled,
    ZoomInRegular, ZoomInFilled, ZoomOutRegular, ZoomOutFilled,
    MidiRegular, MidiFilled,
    ArrowTrendingTextRegular,
    DocumentRegular, ChatHelpRegular, ChatHelpFilled,
    FolderOpenRegular, FolderOpenFilled,
    SettingsRegular, SettingsFilled,
    InfoRegular, InfoFilled,
    DocumentOnePageSparkleRegular, PersonVoiceRegular, HandshakeRegular,
    LayoutColumnTwoFocusLeftFilled, LayoutColumnTwoFocusRightFilled
} from "@fluentui/react-icons"

const CutIcon = bundleIcon(CutFilled, CutRegular);
const PasteIcon = bundleIcon(ClipboardPasteFilled, ClipboardPasteRegular);
const EditIcon = bundleIcon(EditFilled, EditRegular);
const PlayIcon = bundleIcon(PlayRegular, PlayFilled)
const SaveIcon = bundleIcon(SaveRegular, SaveFilled)
const ZoomInIcon = bundleIcon(ZoomInRegular, ZoomInFilled)
const ZoomOutIcon = bundleIcon(ZoomOutRegular, ZoomOutFilled)
const MidiIcon = bundleIcon(MidiRegular, MidiFilled)
const ChatHelpIcon = bundleIcon(ChatHelpRegular, ChatHelpFilled)
const FolderOpenIcon = bundleIcon(FolderOpenRegular, FolderOpenFilled)
const SettingIcon = bundleIcon(SettingsRegular, SettingsFilled)
const InfoIcon = bundleIcon(InfoRegular, InfoFilled)


type menuFunc = {
    onNew: () => void
    saveMIDI: () => void
    saveMusicXML: () => void
    saveText: () => void
    saveAsJson: () => void
    showOpenFileDialog: () => void
    onCompile: () => void
    autoCompose: () => void
}

type MenuComponentPropsType = {
    f: menuFunc
}

export const MenuComponent = memo (({ f }: MenuComponentPropsType) => {

    console.log("menu rendered!!!")

    return <span><Menu hasIcons>
        <MenuTrigger disableButtonEnhancement>
            <ToolbarButton>ファイル</ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
            <MenuList>
                <MenuItem icon={<DocumentRegular />} secondaryContent="Ctrl+N" onClick={f.onNew}>新規作成</MenuItem>
                <MenuItem icon={<FolderOpenIcon />} secondaryContent="Ctrl+O" onClick={f.showOpenFileDialog}>開く</MenuItem>
                <MenuItem icon={<SaveIcon />} secondaryContent="Ctrl+S" onClick={f.saveAsJson}>保存する</MenuItem>
                <MenuDivider />
                <MenuItem icon={<MidiIcon />} onClick={f.saveMIDI}>MIDIで書き出す</MenuItem>
                <MenuItem onClick={f.saveMusicXML}>musicXMLで書き出す</MenuItem>
                <MenuItem onClick={f.saveText}>テキストを書き出す</MenuItem>
            </MenuList>
        </MenuPopover>
    </Menu>
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <ToolbarButton>編集</ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem icon={<DocumentOnePageSparkleRegular />} >文字列をフォーマットする</MenuItem>
                    <MenuItem icon={<EditIcon />} onClick={f.autoCompose}>自動作曲する</MenuItem>
                    <MenuItem icon={<ArrowTrendingTextRegular />} onClick={f.onCompile}>コンパイル</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <ToolbarButton>表示</ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem icon={<LayoutColumnTwoFocusLeftFilled />}>左画面を最大化</MenuItem>
                    <MenuItem icon={<LayoutColumnTwoFocusRightFilled />}>右画面を最大化</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <ToolbarButton>設定</ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem icon={<MidiIcon />}>MIDI機器に接続する</MenuItem>
                    <MenuItem icon={<PersonVoiceRegular />}>VoiceVoxに接続する</MenuItem>
                    <MenuItemLink icon={<SettingIcon />} href="http://localhost:50021/setting" target="_blank">VoiceVox設定</MenuItemLink>
                </MenuList>
            </MenuPopover>
        </Menu>
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <ToolbarButton>ヘルプ</ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItemLink icon={<ChatHelpIcon />} href="/about/manual" target="_blank">マニュアル</MenuItemLink>
                </MenuList>
                <MenuList>
                    <MenuItemLink icon={<HandshakeRegular />} href="https://camp-fire.jp/projects/691016/view?utm_campaign=cp_po_share_c_msg_mypage_projects_show" target="none">ご支援</MenuItemLink>
                </MenuList>
                {/* <MenuList>
                    <MenuItemLink icon={<InfoIcon />} href="https://camp-fire.jp/projects/691016/view?utm_campaign=cp_po_share_c_msg_mypage_projects_show" target="none">このアプリについて</MenuItemLink>
                </MenuList> */}
            </MenuPopover>
        </Menu>
    </span>
})