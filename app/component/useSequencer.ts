import { useRef, useState } from 'react'
import { Sequencer, MIDI, Track_Info } from '@/types'


export const useSequencer = (m: MIDI, tracks: Track_Info[], bpm: number):Sequencer => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [nowTick, setNowTick] = useState(0)
    const [midi, setMIDI] = useState<MIDI>(m)

    const timer = useRef<any>()
    const delayTime = useRef(60 * 1000 / (bpm * 2))
    
    // setTimeOutから正しくnowTickを参照するため
    const nowTickRef = useRef(nowTick)
    nowTickRef.current = nowTick
    // const tickLengthRef = useRef(state.noteDataArray.length)
    // tickLengthRef.current = state.noteDataArray.length

    // tickが進むごとに実行される関数
    const proceed = () => {
        setNowTick(n=>n+1)
        delayTime.current = 60 * 1000 / (bpm * 2)
        timer.current = setTimeout(proceed, delayTime.current)
        play()
    }

    const play = () => {
        tracks.forEach(track=>{
            const notes = track.notes.filter(n=>n.tick === nowTickRef.current)
            // console.log(notes)
            notes.forEach(n=>{
                midi.noteOn(n.pitch)
            })
        })
    }
    const stop = () => {
        setIsPlaying(false)
        clearTimeout(timer.current)
    }
    const first = () => {
        setNowTick(0)
    }
    const setup = () => {
    }
    const playToggle = () => {
        if (isPlaying) {
            stop()
        }
        else {
            setup()
            setIsPlaying(true)
            // setMIDI(m)
            timer.current = setTimeout(proceed, delayTime.current)
        }
    }

    return {nowTick, isPlaying, setNowTick, setMIDI, play, stop, first, playToggle}
}