import React, { useRef, useState } from 'react'
import { Instrument } from './Instrument'

export function useSequencer () {
    const bpm = useRef(120)
    const [isPlaying, setIsPlaying] = useState(false)
    const [nowTick, setNowTick] = useState(0)

    const timer = useRef<any>()
    const delayTime = 60 * 1000 / (bpm.current * 4)
    
    // setTimeOutから正しくnowTickを参照するため
    const nowTickRef = useRef(nowTick)
    nowTickRef.current = nowTick
    // const tickLengthRef = useRef(state.noteDataArray.length)
    // tickLengthRef.current = state.noteDataArray.length

    // tickが進むごとに実行される関数
    const proceed = () => {
        setNowTick(n=>n+1)
        timer.current = setTimeout(proceed, delayTime)
        // if (nowTickRef.current < tickLengthRef.current) {
        //     play()
        //     // seqDispatch({type: 'nextTick'})
        //     timer.current = setTimeout(proceed, delayTime )
        // }
        // else {
        //     // seqDispatch({type: 'stop'})
        //     clearTimeout(timer.current)
        // }
    }

    const play = () => {
        // const nowTick = nowTickRef.current
        //noteDataArray[nowTick].forEach(n=>{
            //seqDispatch({type: 'NOTE_ON', note: n, channel: 0})
        //})
    }
    const stop = () => {
        setIsPlaying(false)
        clearTimeout(timer.current)
    }
    const first = () => {
        setNowTick(0)
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

    return {play, bpm, nowTick, isPlaying, stop, first, playToggle}
}