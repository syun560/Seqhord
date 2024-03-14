import { Note, Res, Var2 } from '../types.ts'
import Lib from '../Lib.ts'

const MajorScale = [0, 0, 2, 4, 5, 7, 9, 11, 12]
const NoteName = ['C','C#', 'D', 'D#','E', 'F', 'F#','G', 'G#','A', 'A#','B']

// 現在のスケールを取得する
const getNowScale = (tick: number, res: Res) => {
    const sf = [...res.scales].filter(sc=>sc.tick<=tick)
    return sf[sf.length - 1].scale
}

// 現在のコードを取得する
const getNowChord = (tick: number, res: Res) => {
    const chof = [...res.chords].filter(cho=>cho.tick<=tick)
    return chof[chof.length - 1]
}

// 変数から実際のノートを生成する
const setVar2Note = (vars2: Var2[], name: string, repeat: number, nowTick: number, res:Res, ch:number) => {
    // vars2をイテレートし、noteを生成する。

    const trans = res.tracks[ch].trans
    const type = res.tracks[ch].type

    const bn = vars2.find(v=> v.name === name)
    if (bn !== undefined) {

        // tickとNoteをずらしたパターンを作る
        let pattern = bn.notes.map(b=>{
            let pitch = 0
            if(type !== 'drum') {
                // その場所（tick）でのコードを取得する
                const found_chord = getNowChord(b.tick + nowTick, res)
            
                // 「0」が指定された場合、コードのルート音ではなく、オンコードの音へ変更する（ex. G/B→ルート音はGではなくB）
                pitch = found_chord.pitch
                if ((type === 'bass' || type === 'chord') && b.pitch % 12 === 0) {
                    pitch = found_chord.on
                }

                // スケールに応じたベースピッチを取得する
                const base_pitch :number = 12 * trans + NoteName.indexOf(getNowScale(nowTick, res))

                // コードのルート音を取得
                pitch += base_pitch + b.pitch

                // コードがマイナーの場合
                if ((b.pitch % 12) === 4 && found_chord.third === 'minor') {
                    pitch -= 1
                }
            }

            return {
                pitch: type !== 'drum' ? pitch : b.pitch,
                pitch_name: type !== 'drum' ? Lib.noteNumberToNoteName(pitch) : b.pitch_name,
                duration: b.duration,
                channel: b.channel,
                velocity: b.velocity,
                mea: Math.floor((b.tick + nowTick) / 8),
                tick: b.tick + nowTick
            }
        })

        // 繰り返しぶん配列を複製する
        let pattern2 = [...pattern]
        for (let i = 1; i < repeat ; i++) {
            pattern2.push(...pattern.map((p, j)=>{
                let pitch = 0
                if (type !== 'drum') {
                    // その場所（tick）でのコードを取得する
                    const found_chord = getNowChord(p.tick + i*8, res)

                    // 「0」が指定された場合、コードのルート音ではなく、オンコードの音へ変更する（ex. G/B→ルート音はGではなくB）
                    pitch = found_chord.pitch
                    if ((type === 'bass' || type === 'chord') && bn.notes[j].pitch % 12 === 0) {
                        pitch = found_chord.on
                    }

                    // スケールに応じたベースピッチを取得する
                    const base_pitch :number = 12 * trans + NoteName.indexOf(getNowScale(p.tick + i * 8,res))

                    // コードのルート音を取得
                    pitch += base_pitch + bn.notes[j].pitch

                    // コードがマイナーの場合
                    if ((bn.notes[j].pitch % 12) === 4 && found_chord.third === 'minor') {
                        pitch -= 1
                    }
                }
                return {
                    pitch: type !== 'drum' ? pitch : p.pitch,
                    pitch_name: type !== 'drum' ? Lib.noteNumberToNoteName(pitch) : p.pitch_name,
                    duration: p.duration,
                    channel: p.channel,
                    velocity: p.velocity,
                    mea: Math.floor((p.tick + i*8) / 8),
                    tick: p.tick + i * 8
                }
            }))
        }

        res.tracks[ch].notes.push(...pattern2)
    }
}

// 変数を認識し、コンパイルする
export const expand_vars = (line: string, res: Res, ch: number, vars2: Var2[]) => {
    // noteを用意する
    let reso = 0.5
    let dur_cnt = 0 // 1小節をカウントする
    let is_note = false // 休符かnoteか
    let mea = res.mea
    let tick = res.mea * 8
    let d_state = 0 // 0: 変数認識, 1:アスタリスク, 2:繰り返し回数認識受付状態
    let tmp_var = ''
    let tmp_repeat = 1

    
    // 一文字目を飛ばして行をイテレート開始
    for (let j = 1; j < line.length; j++) {
    
        const c = line[j]
            
        // 小節の区切り文字
        if (c === '|'){
        }

        // 繰り返しを表す記号
        if (c === '*') {
            d_state = 1
        }

        // 数値であれば繰り返し回数として認識する
        else if (!isNaN(Number(c))) {
            if (d_state === 1) {
                tmp_repeat = Number(c)
                d_state = 2
            }
            else if (d_state === 2) {
                tmp_repeat *= 10
                tmp_repeat += Number(c)
                d_state = 2
            }
        }
        else if (c === '|' || c === ','){
            if (tmp_var !== '') {
                setVar2Note(vars2,tmp_var,tmp_repeat,tick,res,ch)
                tmp_var = ''
                tick += tmp_repeat * 8 // とりあえず、変数の長さは1小節ぶん（8tick）と仮定する
                tmp_repeat = 1
            }
        }
        else {
            d_state = 0
            tmp_var += c
        }
    }
    // 行末までイテレートした場合。
    if (tmp_var !== '') {
        setVar2Note(vars2,tmp_var,tmp_repeat,tick,res,ch)
        tmp_var = ''
        tick += tmp_repeat * 8 // とりあえず、変数の長さは1小節ぶん（8tick）と仮定する
        tmp_repeat = 1
    }
}