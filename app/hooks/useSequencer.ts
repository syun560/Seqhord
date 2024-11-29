import { useRef, useState, useCallback } from 'react'
import { Sequencer, MIDI, Track } from '@/types'


export const useSequencer = (m: MIDI, tracks: Track[], b: number):Sequencer => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [midi, setMIDI] = useState<MIDI>(m)
    
    const timer = useRef<any>()
    const bpm = useRef(b)


    // nowTickはなぜRefが必要なのか？
    const [nowTick, setNowTick] = useState(0)
    const nowTickRef = useRef(nowTick)
    nowTickRef.current = nowTick

    // 現在のトラックの最後のTickの値
    const endTick = useRef(128)
    
    // 現在のBPMから何ms待つか決定する
    const delayTime = useRef(60 * 1000 / (bpm.current * 4))

    // tickが進むごとに実行される関数
    const proceed = () => {
        setNowTick(n=>n+0.5)

        // 現在のBPMから何ms待つか決定する
        delayTime.current = 60 * 1000 / (bpm.current * 4)
        
        // この関数をdelayTime後に再度実行する
        timer.current = setTimeout(proceed, delayTime.current)
        
        if (nowTickRef.current > endTick.current){
            stop()
            first()
        }else{
            play()
        }
    }

    const play = () => {
        console.log(nowTickRef.current)

        // トラックごとにイテレーション
        tracks.forEach(track=>{
            const notes = track.notes.filter(n=>n.tick === nowTickRef.current)
            notes.forEach(n=>{
                midi.noteOn(n.pitch, track.ch, n.duration * delayTime.current * 2)
            })
        })
    }
    const stop = () => {
        setIsPlaying(false)
        midi.allNoteOff()
        clearTimeout(timer.current)
    }
    const nextMea = () => {
        let s = nowTickRef.current + 8
        s = s - s % 8

        console.log("endTick.current: ", endTick.current)
        setNowTick(s)
        if (s > endTick.current){
            stop()
            first()
        }
    }
    const first = useCallback(() => {
        setNowTick(0)
    },[])
    
    const setup = () => {
        bpm.current = b
        endTick.current = 1
        tracks.forEach(track=>{
            midi.programChange(track.program, track.ch)
            midi.volume(track.volume, track.ch)
            
            // console.log(`program: ${track.program}, ch: ${track.ch}`)

            if (track.notes.length > 1) {
                const et = track.notes[track.notes.length - 1].tick + track.notes[track.notes.length - 1].duration
                if(et > endTick.current) endTick.current = et
            }
        })
    }
    const playToggle = useCallback(() => {
        if (isPlaying) {
            stop()
        }
        else {
            setup()
            setIsPlaying(true)
            timer.current = setTimeout(proceed, delayTime.current)
        }
    },[timer.current, isPlaying])

    return {nowTick, isPlaying, setNowTick, setMIDI, play, stop, nextMea, first, playToggle}
}