import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { MIDI } from '@/types'

type MIDIOutPort = {
    device: MIDIOutput
    name: string | null
    ID: string
}

export const useMIDI = (): MIDI => {
    const [, setSelectedOutPortID] = useState('')
    const [outPorts, setOutPorts] = useState<MIDIOutPort[]>([])
    const [outputMap, setOutputMap] = useState<MIDIOutputMap>()
    const masterVolume = useRef(100)
    
    const midiAccess = useRef<MIDIAccess | null>(null)
    const output = useRef<MIDIOutput>()

    const setup = async () => {
        console.log("midi setup")
        try {
            // MIDI機器へのアクセス
            let access = midiAccess.current
            if (!access) access = await navigator.requestMIDIAccess()
            midiAccess.current = access
            console.log("midiAccess: ", access)

            // MIDI出力デバイスの取得
            let tmpOutPorts: MIDIOutPort[] = []
            const tmpOutputMap = access.outputs
            setOutputMap(access.outputs)

            // MIDI出力デバイス一覧の情報を格納
            for (let output of Array.from(tmpOutputMap.values())) {
                tmpOutPorts.push({
                    device: output,
                    name: output.name,
                    ID: output.id
                })
            }
            if (tmpOutPorts.length) {
                setSelectedOutPortID(tmpOutPorts[0].ID)
            }
            setOutPorts(tmpOutPorts)

            // 現在使用するMIDI出力デバイスを指定
            output.current = tmpOutputMap.get(tmpOutPorts[0].ID)

            // デバイスの接続・切断を監視
            access.onstatechange = (event) => {
                const midiEvent = event as MIDIConnectionEvent
                if (midiEvent.port?.state === "connected" || midiEvent.port?.state === "disconnected"){
                    console.log(`MIDI device ${midiEvent.port?.name} is now ${midiEvent.port?.state}`);
                    // setMidiInputs(Array.from(access.inputs.values()));
                    setup()
                }
            };
        }
        catch (err) {
            console.log("MIDI FAILED: ", err)
        }
    }

    // MIDIの開放
    const close = () => {
        if (midiAccess.current) {
            for (const input of Array.from(midiAccess.current.inputs.values())) {
                input.onmidimessage = null
            }
            midiAccess.current.onstatechange = null
            midiAccess.current = null
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // 読み込み時にsetup（不具合があれば、コメントアウト）
        // setup()
        return () => {
            // MIDI を開放
            close()
        }
    },[])

    const programChange = useCallback((program: number, ch: number) => {
        output.current?.send([0xC0 + ch, program])
    },[])
    const controlChange = useCallback((ch: number, eventNumber: number, val: number) => {
        // console.log(`ch: ${ch} panpot: ${eventNumber} val: ${val}`)
        output.current?.send([0xB0 + ch, eventNumber, val])
    },[])

    const setVolume = useCallback((val: number, ch: number) => {
        output.current?.send([0xB0 + ch, 7, val])
    },[])

    const noteOn = useCallback((pitch: number, ch: number, duration: number, offset: number=0) => {
        const vol = masterVolume.current
        output.current?.send([0x90 + ch, pitch, vol], window.performance.now() + offset)
        if (duration > 0)
            output.current?.send([0x80 + ch, pitch, vol], window.performance.now() + offset + duration - 1)
    },[])
    const noteOff = useCallback((pitch: number, ch: number) => {
        output.current?.send([0x80 + ch, pitch, 100])
    },[])
    const allNoteOff = useCallback(() => {
        output.current?.send([0xB0, 0x7B, 0])
    },[])
    const changePorts = useCallback((portNumber: string) => {
        setSelectedOutPortID(portNumber)
        output.current = outputMap?.get(portNumber)
    },[outputMap])

    return useMemo(()=>({
        noteOn, noteOff, setup, setVolume, programChange, controlChange,
        allNoteOff, changePorts, outPorts,
        masterVolume
    }),[noteOn, noteOff, setup, setVolume, programChange, controlChange,
        allNoteOff, changePorts, outPorts,
        masterVolume])
}