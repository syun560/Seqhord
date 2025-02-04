import { useRef, useState, useCallback } from 'react'
import { Sequencer, MIDI, Track, WebAudio } from '@/types'


export const useSequencer = (m: MIDI, tracks: Track[], b: number, audio: WebAudio):Sequencer => {
    const [isPlaying, setIsPlaying] = useState(false)
    const isPlayingRef = useRef(false)

    const [midi, setMIDI] = useState<MIDI>(m)

    // audioが何tickから始まるか？

    
    const timer = useRef<any>()
    const bpm = useRef(b)

    const now = useRef(performance.now())

    // nowTickはなぜRefが必要なのか？
    const [nowTick, setNowTick] = useState(0)
    const nowTickRef = useRef(nowTick)
    nowTickRef.current = nowTick

    // 現在のトラックの最後のTickの値
    const endTick = useRef(128)
    
    // 現在のBPMから何ms待つか決定する
    const delay_time = useRef(60 * 1000 / (bpm.current * 4))

    // tickが進むごとに実行される関数
    const proceed = () => {
        setNowTick(n=>n+0.5)

        // 現在のBPMから何ms待つか決定する
        const ideal = 60 * 1000 / (bpm.current * 4)
        const diff = performance.now() - now.current
        const delay = diff > ideal ? diff - ideal : 0
        delay_time.current = ideal - delay


        if (delay_time.current < 4) delay_time.current = 4
        
        // console.log("ideal_delay: ", ideal)
        // console.log("real_delay: ", delay)

        now.current = performance.now()

        // この関数をdelayTime後に再度実行する
        timer.current = setTimeout(proceed, delay_time.current)
        
        if (nowTickRef.current > endTick.current){
            stop()
            first()
        }else{
            play()
        }
    }

    const play = () => {
        // console.log(nowTickRef.current)

        // トラックごとにイテレーション
        tracks.forEach(track=>{
            const notes = track.notes.filter(n=>n.tick === nowTickRef.current)
            notes.forEach(n=>{
                midi.noteOn(n.pitch, track.ch, n.duration * delay_time.current * 2)
            })
        })
    }
    const stop = () => {
        setIsPlaying(false)
        isPlayingRef.current = false
        midi.allNoteOff()
        clearTimeout(timer.current)

        audio.stop()
    }
    const nextMea = () => {
        let s = nowTickRef.current + 8
        s = s - s % 8

        setNowTick(s)
        if (s > endTick.current){
            stop()
            first()
        }
    }
    const prevMea = () => {
        let s = nowTickRef.current - 8
        s = s - s % 8
        if (s < 0) s = 0

        setNowTick(s)
    }

    const first = useCallback(() => {
        setNowTick(0)
    },[])
    const last = () => {
        setNowTick(endTick.current)
    }

    const setup = () => {
        bpm.current = b
        endTick.current = 1
        now.current = performance.now()
        tracks.forEach(track=>{
            midi.programChange(track.program, track.ch)
            midi.controlChange(track.ch, 10, track.panpot) // パンの設定
            midi.controlChange(track.ch, 91, track.reverb) // リバーブの設定
            midi.setVolume(track.volume, track.ch)
            
            // console.log(`program: ${track.program}, ch: ${track.ch}`)

            if (track.notes.length > 1) {
                const et = track.notes[track.notes.length - 1].tick + track.notes[track.notes.length - 1].duration
                if(et > endTick.current) endTick.current = et
            }
        })
    }
    const playToggle = () => {
        if (isPlayingRef.current) {
            stop()
            audio.stop()
        }
        else {
            setup()
            setIsPlaying(true)
            isPlayingRef.current = true
            timer.current = setTimeout(proceed, delay_time.current)

            // WebAudioの再生も行う
            audio.play()
        }
    }

    return {
        nowTick,
        isPlaying,
        setNowTick,
        setMIDI,
        play, stop,
        nextMea, prevMea, first, last,
        playToggle
    }
}