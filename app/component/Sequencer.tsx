import React, { useRef, useState } from 'react'

export default function Sequencer () {
    const bpm = 120
    const [isPlaying, setIsPlaying] = useState(false)

    const timer = useRef<any>()
    const delayTime = 60 * 1000 / (bpm * 2)

    // setTimeOutから正しくnowTickを参照するため

    const nowTickRef = useRef(seqState.nowTick)
    nowTickRef.current = seqState.nowTick
    const tickLengthRef = useRef(state.noteDataArray.length)
    tickLengthRef.current = state.noteDataArray.length

    // tickが進むごとに実行される関数
    const proceed = () => {
        if (nowTickRef.current < tickLengthRef.current) {
            play()
            // seqDispatch({type: 'nextTick'})
            timer.current = setTimeout(proceed, delayTime )
        }
        else {
            // seqDispatch({type: 'stop'})
            clearTimeout(timer.current)
        }
    }

    const play = () => {
        const nowTick = nowTickRef.current
        noteDataArray[nowTick].forEach(n=>{
            //seqDispatch({type: 'NOTE_ON', note: n, channel: 0})
        })
    }
    const stop = () => {
        // seqDispatch( {type: 'setIsPlaying', isPlaying: false })
        clearTimeout(timer.current)
    }
    const first = () => {
        // seqDispatch({type: 'setNowTick',  nowTick: 0})
    }
    const playToggle = () => {
        if (isPlaying) {
            stop()
        }
        else {
            setIsPlaying(true)
            timer.current = setTimeout(proceed, delayTime)
        }
    }

    return <span>
        <button className="btn btn-secondary mx-1" onClick={first}>
        l＜
        </button>
        <button className="btn btn-primary me-1" onClick={playToggle}>
            {isPlaying ? 'II' : '▶' }
        </button>
    </span>
}