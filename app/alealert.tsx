import React from "react"

export const Ala : React.FC = () => {
    return (
    <div className="alert alert-primary mt-3 alert-dismissible fade show" role="alert">
        <li>SMMLは簡易音楽記述言語です。</li>
        <li>記述した楽譜を、SMF（標準MIDIファイル）へと変換します</li>
        <li>バグ、要望等は<a href="https://github.com/syun560/majic" className="alert-link">GitHub</a>にてご連絡ください。</li>
        {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
    </div>
    )
}