// See https://github.com/danigb/soundfont-player

import { Soundfont, getSoundfontNames } from 'smplr';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sound } from '@/types'

export const useSoundFont = ():Sound => {

    const [instrument ,setInstrument] = useState<Soundfont|null>(null)
    const [audioContext, setAudioContext] = useState<AudioContext|null>(null)
    const [instrumentName, setInstrumentName] = useState<string>('cello')

    // console.log(getSoundfontNames())

    const setup = useCallback(() => {
        setAudioContext(new window.AudioContext())
    },[])

    useEffect(()=>{
        loadInstrument(instrumentName)
    }, [instrumentName, audioContext])

    const loadInstrument = useCallback(async (instrumentName: string) => {
        if (!audioContext) return

        // Re-trigger loading state
        setInstrument(null)

        try{
            const inst = await new Soundfont(audioContext, {instrument: instrumentName, loadLoopData: true }).load
            setInstrument(inst)
        }
        catch(err){
            console.error("loadInstrument error: ", err)
        }
    },[audioContext])

    const playNote = useCallback((midiNumber:string) => {
        if (!audioContext || !instrument) return
        instrument.start(midiNumber)
    },[audioContext ,instrument])

    const stopNote = useCallback((midiNumber: string) => {
        if (!audioContext || !instrument) return
        instrument.stop(midiNumber)
    },[audioContext, instrument])

    const stopAllNotes = useCallback(() => {
        if (!audioContext) return
        instrument?.stop()
    },[audioContext, instrument])

    return useMemo(()=>({
        isLoading: instrument,
        setup,
        playNote,
        stopNote,
        stopAllNotes
    }),[instrument, setup, stopNote, playNote ])
}
