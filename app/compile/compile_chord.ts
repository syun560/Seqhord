import { Res } from '../types.ts'

const MajorNoteName = ['C', 'C', 'D', 'E', 'F','G', 'A','B']
const NoteName = ['C','C#', 'D', 'D#','E', 'F', 'F#','G', 'G#','A', 'A#','B']

// コードを取得する
export const compile_chord = (line: string, i: number, res: Res, c: number) => {
    // コードを小節線（|）で分割する
    //const cs = line.split('|')

    let mea = res.mea
    let chord_name = ''
    let c_state = 0 // 0: 通常, 1: オンコード待機状態, 2:オンコード入力状態
    for (let j = 2; j < line.length; j++) {
        
        const c = line[j]
        // C, D, E
        if (MajorNoteName.includes(c)) {            
            const pitch = NoteName.indexOf(c)
            if (c_state !== 1) {
                chord_name = c
                res.chords.push({
                    mea: mea,
                    tick: mea * 8,
                    pitch: pitch,
                    chord_name: chord_name,
                    third: 'major',
                    on: pitch
                })
            }else{
                res.chords[res.chords.length - 1].on = pitch
                res.chords[res.chords.length - 1].chord_name += c
                c_state = 2
            }
        }
        // #
        else if (c === '#') {
            if (c_state === 2) {
                c_state = 0
            }else{
                res.chords[res.chords.length - 1].pitch += 1
            }
            res.chords[res.chords.length - 1].on += 1
            res.chords[res.chords.length - 1].chord_name += '#'
        }
        // m, M, sus4, dim, aug, add9
        else if (c === 'm') {
            res.chords[res.chords.length - 1].chord_name += 'm'
            res.chords[res.chords.length - 1].third = 'minor'
        }
        else if (c === '/') {
            res.chords[res.chords.length - 1].chord_name += '/'
            c_state = 1
        }
        else if (c === 'M'){
            res.chords[res.chords.length - 1].chord_name += 'M'
            res.chords[res.chords.length - 1].seventh = 'major'
        }
        else if (c === '7'){
            res.chords[res.chords.length - 1].chord_name += '7'
            res.chords[res.chords.length - 1].seventh = 'minor'
        }
        else if (c === '|'){
            mea += 1
        }
    }
}