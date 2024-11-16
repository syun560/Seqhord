import React from "react"

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
    DocumentRegular, ChatHelpRegular, ChatHelpFilled,
    FolderOpenRegular, FolderOpenFilled,
    SettingsRegular, SettingsFilled
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
    seq: any 
}

export const MenuComponent = ({ f, seq }: MenuComponentPropsType) => {

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
                    <MenuItem secondaryContent="Ctrl+Z" icon={<CutIcon />}>元に戻す</MenuItem>
                    <MenuItem secondaryContent="Ctrl+Y" icon={<PasteIcon />}>やり直す</MenuItem>
                    <MenuItem icon={<EditIcon />} >文字列をフォーマットする</MenuItem>
                    <MenuItem icon={<EditIcon />} onClick={f.autoCompose}>自動作曲する</MenuItem>
                    <MenuItem icon={<EditIcon />} onClick={f.onCompile}>コンパイル</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <ToolbarButton>表示</ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem icon={<ZoomInIcon />}>拡大</MenuItem>
                    <MenuItem icon={<ZoomOutIcon />}>縮小</MenuItem>
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
                <ToolbarButton>設定</ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItemLink icon={<SettingIcon />} href="http://localhost:50021/setting" target="none">VoiceVox設定</MenuItemLink>
                </MenuList>
            </MenuPopover>
        </Menu>
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <ToolbarButton>ヘルプ</ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItemLink icon={<ChatHelpIcon />} href="https://www.google.com" target="none">マニュアル</MenuItemLink>
                </MenuList>
                <MenuList>
                    <MenuItemLink icon={<ChatHelpIcon />} href="https://camp-fire.jp/projects/691016/view?utm_campaign=cp_po_share_c_msg_mypage_projects_show" target="none">ご支援</MenuItemLink>
                </MenuList>
                <MenuList>
                    <MenuItemLink icon={<ChatHelpIcon />} href="https://camp-fire.jp/projects/691016/view?utm_campaign=cp_po_share_c_msg_mypage_projects_show" target="none">このアプリについて</MenuItemLink>
                </MenuList>
            </MenuPopover>
        </Menu>
    </span>
}