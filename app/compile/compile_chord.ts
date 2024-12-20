import { Res } from '../types.ts'

const MajorNoteName = ['C', 'C', 'D', 'E', 'F','G', 'A','B']
const NoteName = ['C','C#', 'D', 'D#','E', 'F', 'F#','G', 'G#','A', 'A#','B']

// コードを取得する
export const compile_chord = (line: string, i: number, res: Res, c: number) => {
    
    let tick = res.tick
    let chord_name = ''
    const reso = 1
    let c_state = 0 // 0: 通常, 1: オンコード待機状態, 2:オンコード入力状態
    let m_state = 0 // 0: 通常, 1: 1小節に1コード, 2: 1小節に複数コード（「_」使用時）

    for (let j = 2; j < line.length; j++) {
        
        const c = line[j]
        // C, D, E
        if (MajorNoteName.includes(c)) {            
            const pitch = NoteName.indexOf(c)
            if (c_state !== 1) {
                chord_name = c
                res.chords.push({
                    tick: tick++,
                    pitch: pitch,
                    chord_name: chord_name,
                    third: 'major',
                    on: pitch
                })
                m_state = 1
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
            if(m_state === 0) tick += 8
            if(m_state === 1) tick += 7
            m_state = 0
        }
        else if (c === '_'){
            tick += reso
            m_state = 2
        }
    }
}