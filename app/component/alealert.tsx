import React from "react"
import { useState } from "react"

export const Ala : React.FC = () => {
    const [isOpen, setIsOpen] = useState(true)

    const doClick = () =>{
        setIsOpen(false)
    }

    return !isOpen ? <></>:
    <div className="alert alert-primary mt-3 alert-dismissible fade show" role="alert">
        <li>記述した楽譜を、SMF（標準MIDIファイル）, MusicXML（NEUTRINO用）へと変換します</li>
        <li>バグ、要望等は<a href="https://github.com/syun560/mugic" className="alert-link">GitHub</a>にてご連絡ください。</li>
        <button type="button" onClick={doClick} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
}