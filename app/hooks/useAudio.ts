import { useState, useRef, useEffect } from "react";
import { WebAudio } from 'types'

const impulse = "/audios/ir_centre_stalls.wav"

export const useAudio = ():WebAudio => {
    const audioContext = useRef<AudioContext | null>(null)
    const audioBuffer = useRef<AudioBuffer | null>(null)
    const source = useRef<AudioBufferSourceNode | null>(null)
    const dryGain = useRef<GainNode | null>(null)
    const wetGain = useRef<GainNode | null>(null)
    const convolver = useRef<ConvolverNode | null>(null)
    const isPlay = useRef(false)
    const isStoppedManually = useRef(false)
    const startTime = useRef(0) // 再生開始位置を保存する

    const [url, setURL] = useState<string|null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.8) // デフォルト音量 80%

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (url) {
            const initAudio = async () => {
                const context = new window.AudioContext()
                const oldContext = audioContext.current // 前再生していた情報を取得するため。
                audioContext.current = context

                // GainNode（音量調整ノード）を作成
                const drygain = context.createGain()
                drygain.gain.value = volume * 0.7
                dryGain.current = drygain

                const wetgain = context.createGain()
                wetgain.gain.value = volume * 0.3
                wetGain.current = wetgain

                // ConvolverNode（リバーブノード）を作成
                convolver.current = context.createConvolver()

                // インパルス応答データをロード
                const res = await fetch(impulse);
                const arrayBuff = await res.arrayBuffer();
                const impulseBuffer = await audioContext.current.decodeAudioData(arrayBuff);
                convolver.current.buffer = impulseBuffer;

                // 音声データをロード
                const response = await fetch(url)
                const arrayBuffer = await response.arrayBuffer()
                const decodedBuffer = await context.decodeAudioData(arrayBuffer)
                audioBuffer.current = decodedBuffer

                // もし再生中ならnewSourceを前の位置からシークして再生する
                if (isPlay.current && oldContext) {
                    console.log("再生中なのでPlay！！！")
                    console.log(oldContext.currentTime - startTime.current)
                    // isPlay.current = false
                    play(oldContext.currentTime - startTime.current + 0.071)
                }
            }

            initAudio()
        }

        return () => {
            audioContext.current?.close()
        }
    }, [url]) // URLが変わるたびに新しい音声をロード

    // 再生
    const play = (seekTime: number = startTime.current) => {
        if (!audioContext.current || !audioBuffer.current || !dryGain.current || !wetGain.current || !convolver.current ) return

        // 一時停止していた場合は再開
        if (source.current && !isPlay.current) {
            console.log("再開！！！")
            audioContext.current.resume()
            isPlay.current = true
            setIsPlaying(true)
            return
        }

        console.log("new Source!!!")

        // 新しいSourceを作成する
        const newSource = audioContext.current.createBufferSource()
        newSource.buffer = audioBuffer.current

        // ドライ信号: source -> dryGain -> destination
        newSource.connect(dryGain.current)
        dryGain.current.connect(audioContext.current.destination)

        // ウェット信号: source -> convolver -> wetGain -> destination
        newSource.connect(convolver.current)
        convolver.current.connect(wetGain.current)
        wetGain.current.connect(audioContext.current.destination)

        // 再生
        newSource.start(0, seekTime)
        source.current = newSource
        isPlay.current = true
        setIsPlaying(true)
        startTime.current = audioContext.current.currentTime - seekTime

        // 再生終了時の処理
        newSource.onended = () => {
            if (!isStoppedManually.current) {
                isPlay.current = false
                setIsPlaying(false)
                source.current = null
            }
            isStoppedManually.current = false
        }
    }

    const seek = (time: number) => {
        if (audioContext.current && audioBuffer.current) {
            if (time < 0) time = 0
            if (time > audioBuffer.current.duration) time = audioBuffer.current.duration

            // startTime.current = audioContext.current.currentTime - time

            // 再生中の場合、一旦停止してSourceを破棄しシーク位置から新しく再生する
            if (isPlay.current) {
                isStoppedManually.current = true
                source.current?.stop()
                play(time)
            }
        }
    }

    // 一時停止
    const pause = () => {
        if (audioContext.current && isPlay.current) {
            audioContext.current.suspend()
            isPlay.current = false
            setIsPlaying(false)
            // setCurrentTime(audioContext.currentTime)
        }
    }

    // 停止
    const stop = () => {
        if (source.current) {
            source.current.stop()
            source.current = null
        }
        isPlay.current = false
        setIsPlaying(false)
    }

    // 音量調整
    const changeVolume = (value: number) => {
        if (dryGain.current) {
            dryGain.current.gain.value = value * 0.7
            setVolume(value)
        }
        if (wetGain.current) {
            wetGain.current.gain.value = value * 0.3
            setVolume(value)
        }
    }

    return { play, pause, seek, stop, isPlay, isPlaying, startTime, audioBuffer, changeVolume, volume, setURL }
}