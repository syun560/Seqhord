import React,{ memo } from 'react'
//@ts-ignore
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import { Sound, MIDI } from '@/types'
import 'react-piano/dist/styles.css'
import { channel } from 'diagnostics_channel'

type PianoBoardPropsType = {
    sf: Sound
    midi: MIDI
    ch: number
}

export const PianoBoard = memo(function PianoBoard({sf, midi, ch}:PianoBoardPropsType) {
    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('f5');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote,
        lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    })

    const playNote = (midiNumber :string) => {
        midi.noteOn(Number(midiNumber), ch)
    }
    const stopNote = (midiNumber :string) => {
        midi.noteOff(Number(midiNumber), ch)
    }

    return <div style={{height: "53%"}}>
        <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            // playNote={sf.playNote}
            playNote={playNote}
            // stopNote={sf.stopNote}
            stopNote={stopNote}
            width={380}
            keyboardShortcuts={keyboardShortcuts}
        />
    </div>
})