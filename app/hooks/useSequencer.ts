import { useRef, useState, useCallback } from 'react'
import { Sequencer, MIDI, Track, WebAudio } from '@/types'

export const useSequencer = (m: MIDI, tracks: Track[], b: number, audio: WebAudio):Sequencer => {
    // 再生しているかどうか
    const [isPlaying, setIsPlaying] = useState(false)
    const isPlayingRef = useRef(false)

    // WEB MIDI API
    const [midi, setMIDI] = useState<MIDI>(m)

    // setTimeoutのタイマーの識別子を保存しておくRef
    const timer = useRef<any>()
    const bpm = useRef(b)

    // 再生開始した時間
    const start_time = useRef(performance.now())
    const start_tick = useRef(0)
    
    // tick
    const [nowTick, setNowTickState] = useState(0)
    const nowTickRef = useRef(0)
    const played_tick = useRef(0) // 再生予約済のティック
    
    // 現在のトラックの最後のTickの値
    const endTick = useRef(128)
    
    // ループを回す時間（ms）
    const proceed_time = 50

    // シークが起きた場合
    const setNowTick = (tick: number) => {
        setNowTickState(tick)
        nowTickRef.current = tick
        
        if (isPlayingRef.current) {

            start_time.current = performance.now()
            start_tick.current = nowTickRef.current
            played_tick.current = nowTickRef.current
            clearTimeout(timer.current)
            timer.current = setTimeout(proceed, proceed_time)
            midi.allNoteOff()
            
            // Audioの再生
            if (tracks[0].voice && nowTickRef.current >= tracks[0].voice) {
                const offset = (nowTickRef.current - tracks[0].voice) * 60  / (bpm.current * 2) + 0.171
                audio.seek(offset)
            }
            else {
                audio.stop()
            }
        }
    }

    // ループして実行される関数
    const proceed = () => {
        // 現在のtickをスタートしてからの時間で計算する
        const tick = start_tick.current + (performance.now() - start_time.current) / (60 * 1000 / (bpm.current * 2))

        setNowTickState(Math.round(tick))
        nowTickRef.current = tick
        timer.current = setTimeout(proceed, proceed_time)
        
        if (nowTickRef.current > endTick.current){
            stop()
            first()
        }else{
            play()
        }
    }

    const play = () => {
        // 1ティックの時間（ms）
        const tick_time = 60 * 1000 / (bpm.current * 2)
        
        // 演奏予定のTick（proceed_timeの三倍とる）
        const scheduled_tick = nowTickRef.current + proceed_time * 3 / tick_time

        // トラックごとにイテレーション
        tracks.forEach(track=>{
            // Midi
            const notes = track.notes.filter(n=>
                played_tick.current <= n.tick &&
                n.tick < scheduled_tick
            )
            notes.forEach(n=>{
                const offset = (n.tick - nowTickRef.current) * tick_time
                midi.noteOn(n.pitch, track.ch, n.duration * tick_time, offset)
            })

            // Voice
            const voice = tracks[0].voice
            if (!audio.isPlay.current && voice && played_tick.current <= voice && voice < scheduled_tick) {
                const offset = 0.171 - (voice - nowTickRef.current) * 60  / (bpm.current * 2) 
                audio.play(offset > 0 ? offset : 0)
            }
        })

        // 演奏されたTickを保存する
        played_tick.current = scheduled_tick
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

        setIsPlaying(true)
        isPlayingRef.current = true
        
        // 各種タイマーのセットアップ
        start_time.current = performance.now()
        start_tick.current = nowTickRef.current
        played_tick.current = nowTickRef.current
        
        // ループの開始
        timer.current = setTimeout(proceed, proceed_time)

        // WebAudio（Voice）の再生も行う
        if (tracks[0].voice && nowTickRef.current >= tracks[0].voice) {
            const offset = (nowTickRef.current - tracks[0].voice) * 60  / (bpm.current * 2) + 0.171
            audio.play(offset)
        }
    }
    const playToggle = () => {
        if (isPlayingRef.current) {
            stop()
            audio.stop()
        }
        else {
            setup()
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