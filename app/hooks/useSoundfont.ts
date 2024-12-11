// See https://github.com/danigb/soundfont-player

import Soundfont, { InstrumentName } from 'soundfont-player';
import { useState, useEffect } from 'react';
import { Sound } from '@/types'

type Props = {
    instrumentName: InstrumentName
    hostname: string
    format?: 'mp3' | 'ogg'
    soundfont?: 'MusyngKite' | 'FluidR3_GM'
}

type AudioNodes = {
    [key: string]: Soundfont.Player | null
}

export const useSoundFont = ({
        instrumentName = 'acoustic_grand_piano',
        hostname ,
        format = 'mp3',
        soundfont = 'MusyngKite',
    }: Props):Sound => {

    const [activeAudioNodes, setActiveAudioNodes] = useState<AudioNodes>({})
    const [instrument ,setInstrument] = useState<Soundfont.Player|null>(null)
    const [audioContext, setAudioContext] = useState<AudioContext|null>(null)

    const setup = () => {
        setAudioContext(new window.AudioContext())
    }        

    useEffect(()=>{
        loadInstrument(instrumentName)
    }, [instrumentName, audioContext])

    const loadInstrument = async (instrumentName: InstrumentName) => {
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
    }

    const playNote = (midiNumber:string) => {
        if (!audioContext) return
        audioContext.resume().then(() => {
            const audioNode = instrument?.play(midiNumber)
            setActiveAudioNodes((aa)=>({...aa, [midiNumber]: audioNode!}))
        })
    }

    const stopNote = (midiNumber: string) => {
        if (!audioContext) return
        audioContext.resume().then(() => {
            if (!activeAudioNodes[midiNumber]) return
            const audioNode = activeAudioNodes[midiNumber]
            audioNode.stop();
            setActiveAudioNodes((aa)=>({...aa, [midiNumber]: null }))
        })
    }

    // Clear any residual notes that don't get called with stopNote
    const stopAllNotes = () => {
        if (!audioContext) return
        audioContext.resume().then(() => {
            const aan = Object.values(activeAudioNodes);
            aan.forEach(node => {
                if (node) node.stop()
            })
            setActiveAudioNodes({})
        })
    }

    return {
        isLoading: instrument,
        setup,
        playNote,
        stopNote,
        stopAllNotes
    }
}
