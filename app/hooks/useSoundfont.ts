// See https://github.com/danigb/soundfont-player

import Soundfont, { InstrumentName } from 'soundfont-player';
import { useState, useEffect, useCallback } from 'react';
import { Sound } from '@/types'

const hostname:string = 'https://d1pzp51pvbm36p.cloudfront.net'
const format: 'mp3' | 'ogg' = 'mp3'
const soundfont: 'MusyngKite' | 'FluidR3_GM' = 'MusyngKite'


type AudioNodes = {
    [key: string]: Soundfont.Player | null
}

export const useSoundFont = ():Sound => {

    const [activeAudioNodes, setActiveAudioNodes] = useState<AudioNodes>({})
    const [instrument ,setInstrument] = useState<Soundfont.Player|null>(null)
    const [audioContext, setAudioContext] = useState<AudioContext|null>(null)
    const [instrumentName, setInstrumentName] = useState<InstrumentName>('acoustic_grand_piano')

    const setup = useCallback(() => {
        setAudioContext(new window.AudioContext())
    },[])

    useEffect(()=>{
        console.log('うせ')
        loadInstrument(instrumentName)
    }, [instrumentName, audioContext])

    const loadInstrument = useCallback(async (instrumentName: InstrumentName) => {
        if (!audioContext) return

        // Re-trigger loading state
        setInstrument(null)

        try{
            const inst = await Soundfont.instrument(audioContext, instrumentName, {
                format,
                soundfont,
                nameToUrl: (name:string, soundfont:string, format:string) => {
                    return `${hostname}/${soundfont}/${name}-${format}.js`
                },
            })
            setInstrument(inst)
        }
        catch(err){
            console.error("loadInstrument error: ", err)
        }
    },[audioContext,instrumentName])

    const playNote = useCallback((midiNumber:string) => {
        if (!audioContext || !instrument) return
        audioContext.resume().then(() => {
            const audioNode = instrument.play(midiNumber)
            setActiveAudioNodes((aa)=>({...aa, [midiNumber]: audioNode}))
        })
    },[audioContext ,instrument])

    const stopNote = useCallback((midiNumber: string) => {
        if (!audioContext) return
        audioContext.resume().then(() => {
            if (!activeAudioNodes[midiNumber]) return
            const audioNode = activeAudioNodes[midiNumber]
            audioNode.stop();
            setActiveAudioNodes((aa)=>({...aa, [midiNumber]: null }))
        })
    },[audioContext,activeAudioNodes])

    // Clear any residual notes that don't get called with stopNote
    const stopAllNotes = useCallback(() => {
        if (!audioContext) return
        audioContext.resume().then(() => {
            const aan = Object.values(activeAudioNodes);
            aan.forEach(node => {
                if (node) node.stop()
            })
            setActiveAudioNodes({})
        })
    },[audioContext, activeAudioNodes])

    return {
        isLoading: instrument,
        setup,
        playNote,
        stopNote,
        stopAllNotes
    }
}
