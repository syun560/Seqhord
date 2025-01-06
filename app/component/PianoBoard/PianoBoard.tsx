import React,{ memo } from 'react'
//@ts-ignore
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import { Sound } from '@/types'
import 'react-piano/dist/styles.css'

type PianoBoardPropsType = {
    sf: Sound
}

export const PianoBoard = memo(function PianoBoard({sf}:PianoBoardPropsType) {
    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('f5');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    })    

    return <div style={{height: "53%"}}>
        <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={sf.playNote}
            stopNote={sf.stopNote}
            width={380}
            keyboardShortcuts={keyboardShortcuts}
        />
    </div>
})