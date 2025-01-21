import { useState, useRef } from 'react'
import { MIDI } from '@/types'

export const useMIDI = (): MIDI => {
    const [selectedOutPortID, setSelectedOutPortID] = useState('')
    const [outPorts, setOutPorts]: [any, any] = useState([])
    const [outputs, setOutputs] = useState<any>()
    const masterVolume = useRef(100)

    const output = useRef<MIDIOutput>()

    const programChange = (program: number, ch: number) => {
        output.current?.send([0xC0 + ch, program])
    }
    const controlChange = ( ch:number, eventNumber: number, val:number) => {
        // console.log(`ch: ${ch} panpot: ${eventNumber} val: ${val}`)
        output.current?.send([0xB0 + ch, eventNumber, val])
    }

    const setVolume = (val: number, ch: number) => {
        output.current?.send([0xB0 + ch, 7, val])
    }

    const noteOn = (pitch: number, ch: number, duration?: number) => {
        const vol = masterVolume.current
        output.current?.send([0x90 + ch, pitch, vol])
        if (duration !== undefined)
        output.current?.send([0x80 + ch, pitch, vol], window.performance.now() + duration - 1)
    }
    const noteOff = (pitch: number, ch: number) => {
        output.current?.send([0x80 + ch, pitch, 100])
    }
    const allNoteOff = () => {
        output.current?.send([0xB0, 0x7B, 0])
    }
    const changePorts = (portNumber: string) => {
        setSelectedOutPortID(portNumber)
        output.current = outputs.get(portNumber)
    }

    const setup = async () => {
        try {
            const midiAccess = await navigator.requestMIDIAccess()
            console.log("midiAccess: ", midiAccess)

            // OutPortの取得、設定
            let outPorts: any = []
            const tmpOutputs: any = midiAccess.outputs
            setOutputs(midiAccess.outputs)
            for (let output of tmpOutputs.values()) {
                outPorts.push({
                    device: output,
                    name: output.name,
                    ID: output.id
                })
            }
            if (outPorts.length) {
                setSelectedOutPortID(outPorts[0].ID)
            }
            setOutPorts(outPorts)

            const op: MIDIOutput = tmpOutputs.get(outPorts[0].ID)
            console.log(op)
            output.current = op

            // console.log(outPorts[0].ID)
        }
        catch (err) {
            console.log("MIDI FAILED:", err)
        }
    }

    return { noteOn, noteOff, setup, setVolume, programChange, controlChange, 
        allNoteOff, changePorts, outPorts,
        masterVolume
    }
}