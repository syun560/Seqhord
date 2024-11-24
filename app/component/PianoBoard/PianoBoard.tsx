import React from 'react'
//@ts-ignore
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'

export const PianoBoard = () => {
    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('f5');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    return <div style={{height: "53%"}}>
        <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={(midiNumber: number) => {
                // Play a given note - see notes below
            }}
            stopNote={(midiNumber: number) => {
                // Stop playing a given note - see notes below
            }}
            width={380}
            keyboardShortcuts={keyboardShortcuts}
        />
    </div>
}