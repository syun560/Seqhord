import { Note, Res } from '../types.ts'
import Lib from '../Lib.ts'

const MajorScale = [0, 0, 2, 4, 5, 7, 9, 11, 12]
const NoteName = ['C','C#', 'D', 'D#','E', 'F', 'F#','G', 'G#','A', 'A#','B']

// ドラムパターン
type BNote = {
    name: string
    notes: Note[]
}

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

// 変数を認識し、コンパイルする（現在はドラムのみ想定）
export const compile_bass = (text: string, res: Res, ch: number) => {

    // 文字列を改行ごとに分割して配列に入れる
    const lines = text.split('\n')

    // noteを用意する
    const b_notes: BNote[] = []
    let tmp_notes: Note[] = []

    let reso = 0.5
    let octarve = 0
    let dur_cnt = 0 // 1小節をカウントする
    let is_note = false // 休符かnoteか

    // ベースノートを生成する
    // 文字列を検索する
    lines.forEach((l, i) => {
        // 空白文字の削除
        const line = l.replace(/\s+/g, "")

        let tick = 0

        // @キーワード
        if (line.indexOf('@') !== -1) {            
            // tmp_notesの追加
            if (line.indexOf('n') !== -1) {

                const i = line.indexOf('=')
                const b = line.slice(i + 1)
                b_notes.push({
                    name: b,
                    notes: []
                })
                tick = 0
            }
            if (line[1] === 'e') {
                b_notes[b_notes.length - 1].notes = [...tmp_notes]
                tmp_notes = []
            }
        }
        else{
            // コメント
            if (line[0] === '#') { }
            // ノート
            else if (line[0] === 'b') {
                tick = 0
                const p = line[0]

                // 一文字目を飛ばして行をイテレート開始

                for (let j = 1; j < line.length; j++) {
                    const c = line[j]
                    
                    // 小節の区切り文字
                    if (c === '|'){
                    }
                    
                    // 休符
                    else if (c === '.'){
                        tick += reso
                        dur_cnt += 1
                        is_note = false
                    }
                    
                    // 前のノートを伸ばす
                    else if (c === '_') {
                        // 配列の最後の要素に対して操作
                        tmp_notes[tmp_notes.length - 1].duration += reso
                        dur_cnt += 1
                        tick += reso
                    }
                    
                    // 数値であればnoteとして認識する
                    else if (!isNaN(Number(c))) {
                        // const pitch = MajorScale[Number(c)] + base_pitch + octarve * 12
                        const pitch = MajorScale[Number(c)]
                        const pitch_name = Lib.noteNumberToNoteName(pitch)

                        tmp_notes.push({
                            pitch: pitch,
                            pitch_name: pitch_name,
                            duration: reso,
                            channel: 2,
                            velocity: 100,
                            mea: 0,
                            tick: tick
                        })
                        tick += reso
                        octarve = 0
                        dur_cnt += 1
                        is_note = true
                    }
                    else {
                        // エラー
                        res.errMsg += `${i+1}行${j+1}文字目(ch: ${ch}): 予期せぬ文字列「${c}」です。\n`
                    }
                }
            }
        }
    })
    
    
    // varsをイテレートし、noteを生成する。
    res.vars.forEach(v=>{
        
        const bn = b_notes.find(d=> d.name === v.name)
        if (bn !== undefined) {

            // tickとNoteをずらしたパターンを作る
            let pattern = bn.notes.map(b=>{

                // その場所（tick）でのコードを取得する
                const found_chord = getNowChord(b.tick + v.tick,res)
                let root = found_chord.on

                // スケールに応じたベースピッチを取得する
                const base_pitch :number = 12 * 2 + NoteName.indexOf(getNowScale(v.tick,res))

                // コードのルート音を取得
                const pitch = base_pitch + root + b.pitch

                return {
                    pitch: pitch,
                    pitch_name: Lib.noteNumberToNoteName(pitch),
                    duration: b.duration,
                    channel: b.channel,
                    velocity: b.velocity,
                    mea: Math.floor((b.tick + v.tick) / 8),
                    tick: b.tick + v.tick
                }
            })

            // 繰り返しぶん配列を複製する
            let pattern2 = [...pattern]
            for (let i = 1; i < v.repeat ; i++) {
                pattern2.push(...pattern.map((p, j)=>{
                    
                    // その場所（tick）でのコードを取得する
                    const found_chord = getNowChord(p.tick + i*8,res)
                    let root = found_chord.on

                    // スケールに応じたベースピッチを取得する
                    const base_pitch :number = 12 * 2 + NoteName.indexOf(getNowScale(p.tick + i * 8,res))

                    // コードのルート音を取得
                    const pitch = base_pitch + root + bn.notes[j].pitch

                    return {
                        pitch: pitch,
                        pitch_name: Lib.noteNumberToNoteName(pitch),
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
    })
}