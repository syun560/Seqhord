import { useState, useCallback, useRef } from 'react'
import { MIDI } from '@/types'

export const useInstrument = (): MIDI => {
    const [selectedOutPortID, setSelectedOutPortID] = useState('')
    const [outPorts, setOutPorts]: [any, any] = useState([])
    const [outputs, setOutputs] = useState<any>()


    const output = useRef<MIDIOutput>()

    const programChange = (program: number, ch: number) => {
        output.current?.send([0xC0 + ch, program])
    }

    const volume = (val: number, ch: number) => {
        output.current?.send([0xB0 + ch, 7, val])
    }

    const noteOn = (pitch: number, ch: number, duration: number) => {
        output.current?.send([0x90 + ch, pitch, 64])
        output.current?.send([0x80 + ch, pitch, 64], window.performance.now() + duration - 1) // 1秒後にノートオフ
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
            console.log("navigator.requestMIDIAccess start...")
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

            console.log(outPorts[0].ID)
            console.log("MIDI READY!!!")
        }
        catch (err) {
            console.log("MIDI FAILED:", err)
        }
    }

    return { noteOn, setup, volume, programChange, allNoteOff, changePorts, outPorts }
}