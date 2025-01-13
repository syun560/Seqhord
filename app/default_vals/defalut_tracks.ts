import { Track } from 'types'

// text
import default_text from './default_text.txt'
import default_append from './default_append.txt'
import default_bass from './default_bass.txt'
import default_drum from './default_drum.txt'
import default_guitar from './default_guitar.txt'

export const default_tracks: Track[] = [
    {
        name: 'melody',
        program: 73,
        ch: 0,
        trans: 5,
        type: 'conductor',
        notes: [],
        texts: default_text,
        volume: 100,
        panpot: 64,
        reverb: 40,
    }, 
    {
        name: 'chord',
        program: 0,
        ch: 2,
        trans: 4,
        type: 'chord',
        notes: [],
        texts: default_append,
        volume: 80,
        panpot: 10,
        reverb: 40
    },
    {
        name: 'bass',
        program: 34,
        ch: 3,
        trans: 5,
        type: 'bass',
        notes: [],
        texts: default_bass,
        volume: 100,
        panpot: 64,
        reverb: 40
    }, {
        name: 'drum',
        program: 0,
        ch: 10,
        trans: 5,
        type: 'drum',
        notes: [],
        texts: default_drum,
        volume: 100,
        panpot: 64,
        reverb: 40
    }
]