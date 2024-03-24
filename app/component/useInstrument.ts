import { useState, useEffect } from 'react'

export const useInstrument = () => {
    const [selectedOutPortID, setSelectedOutPortID] = useState('')
    const [outPorts, setOutPorts]: [any, any] = useState([])
    const [outputs, setOutputs] = useState<any>()

    const registerOutput = () => {

    }

    const programChange = (program: number, ch: number) => {
        const output = outputs.get(selectedOutPortID)
        output.send([0xC0 + ch, program])
    }

    const noteOn = (pitch: number) => {
        const output = outputs.get(selectedOutPortID)
        const ch = 0
        output.send([0x90 + ch, pitch, 40])
        output.send([0x80 + ch, pitch, 40], window.performance.now() + 1000) // 1秒後にノートオフ
    }
    const allNoteOff = () => {
        const output = outputs.get(selectedOutPortID)
        output.send([0xB0, 0x7B, 0])
    }

    // 読み込み時に実行
    useEffect(() => {
        navigator.requestMIDIAccess({ sysex: true }).then(
            // 成功時
            (midiAccess) => {
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
                console.log("MIDI READY!!!");

            },

            // 失敗時
            (msg) => console.log("MIDI FAILED - " + msg)
        )
    }, [])

    return {noteOn ,setSelectedOutPortID, outPorts}
}