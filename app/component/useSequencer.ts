import { useRef, useState } from 'react'
import { Sequencer, MIDI, Track } from '@/types'


export const useSequencer = (m: MIDI, tracks: Track[], b: number):Sequencer => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [nowTick, setNowTick] = useState(0)
    const [midi, setMIDI] = useState<MIDI>(m)

    const timer = useRef<any>()
    const bpm = useRef(b)
    const nowTickRef = useRef(nowTick)
    nowTickRef.current = nowTick

    const delayTime = useRef(60 * 1000 / (bpm.current * 2))
    
    const endTick = useRef(1)

    // tickが進むごとに実行される関数
    const proceed = () => {
        setNowTick(n=>n+1)
        delayTime.current = 60 * 1000 / (bpm.current * 2)
        timer.current = setTimeout(proceed, delayTime.current)
        if (nowTickRef.current > endTick.current){
            stop()
            first()
        }else{
            play()
        }
    }

    const play = () => {
        tracks.forEach(track=>{
            const notes = track.notes.filter(n=>n.tick === nowTickRef.current)
            notes.forEach(n=>{
                midi.noteOn(n.pitch, track.ch, n.duration * delayTime.current)
            })
        })
    }
    const stop = () => {
        setIsPlaying(false)
        midi.allNoteOff()
        clearTimeout(timer.current)
    }
    const first = () => {
        setNowTick(0)
    }
    const setup = () => {
        bpm.current = b
        endTick.current = 1
        tracks.forEach(track=>{
            midi.programChange(track.program, track.ch)
            midi.volume(track.volume, track.ch)
            console.log(`program: ${track.program}, ch: ${track.ch}`)
            if (track.notes.length > 1) {
                const et = track.notes[track.notes.length - 1].tick + track.notes[track.notes.length - 1].duration
                if(et > endTick.current) endTick.current = et
            }
        })
    }
    const playToggle = () => {
        if (isPlaying) {
            stop()
        }
        else {
            setup()
            setIsPlaying(true)
            timer.current = setTimeout(proceed, delayTime.current)
        }
    }

    return {nowTick, isPlaying, setNowTick, setMIDI, play, stop, first, playToggle}
}