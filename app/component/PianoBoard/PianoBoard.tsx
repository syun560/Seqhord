import React,{ memo } from 'react'
//@ts-ignore
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import { Sound, MIDI } from '@/types'
import 'react-piano/dist/styles.css'

type PianoBoardPropsType = {
    sf: Sound
    midi: MIDI
    ch: number
    scale: string
}

const notes_name = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const makeKeyboardShortcuts = (firstNote: number) => {
    const MajorScale = [0, 2, 4, 5, 7, 9, 11, 12]
    const res = MajorScale.map((m, i) => ({key: String(i + 1), midiNumber: firstNote + m}))
    return res
}

export const PianoBoard = memo(function PianoBoard({sf, midi, ch, scale}:PianoBoardPropsType) {
    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('f5');
    // const keyboardShortcuts = KeyboardShortcuts.create({
    //     firstNote,
    //     lastNote,
    //     keyboardConfig: KeyboardShortcuts.HOME_ROW
    // })
    const keyFirst = 48 + notes_name.indexOf(scale)
    const keyboardShortcuts = makeKeyboardShortcuts(keyFirst)

    const playNote = (midiNumber :string) => {
        midi.noteOn(Number(midiNumber), ch, 0)
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