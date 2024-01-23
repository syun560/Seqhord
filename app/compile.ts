import { Note, Chord } from './types.ts'
import Lib from './Lib.ts'

const NoteName = ['C','C#', 'D', 'D#','E', 'F', 'F#','G', 'G#','A', 'A#','B']
const MajorNoteName = ['C', 'C', 'D', 'E', 'F','G', 'A','B']
const MajorScale = [0, 0, 2, 4, 5, 7, 9, 11, 12]

type Res = {
    title: string
    bpm: number
    scale: string
    errMsg: string
    mea: number
    notes: Note[]
    chords: Chord[]
}

// 自作音楽記述言語のコンパイル
export const compile = (text: string) => {
    let res :Res = {
        title: "none",
        bpm: 120,
        scale: 'C',
        errMsg: "",
        mea: 0,
        notes: [],
        chords: []
    }
    // 文字列を改行ごとに分割して配列に入れる
    const lines = text.split('\n')
    const tmp_notes:Note[] = []
    const tmp_chords:Chord[] = []
    let tick = 0
    let reso = 1
    let octarve = 0
    let mea = 0
    let dur_cnt = 0 // 1小節をカウントする
    let kome_cnt = 0 // 「*」の個数をカウントする。
    let is_note = false // 休符かnoteか

    let c_tick = 0
    let c_state = 0

    // 文字列を検索する
    lines.forEach((l, i) => {
        // 空白文字の削除
        const line = l.replace(/\s+/g, "");

        // 行数制限
        if (i > 500) {
            res.errMsg += '入力可能な最大行数(500行)を超えています。コンパイルを中止します。\n'
            return
        }

        // @キーワード
        if (line.indexOf('@') !== -1) {
            // BPM
            if (line.indexOf('b') !== -1) {
                const i = line.indexOf('=')
                const b = Number(line.slice(i + 1))
                res.bpm = b
            }
            // タイトル
            else if (line[1] === 't') {
                const i = line.indexOf('=')
                const t = line.slice(i + 1)
                res.title = t
            }
            // スケール（調）
            else if (line[1] === 's') {
                const i = line.indexOf('=')
                const t = line.slice(i + 1)
                res.scale = t
            }
        }
        else{
            // コメント
            if (line[0] === '#') {

            }
            // コード
            else if (line[0] === 'c') {
                // コードを小節線（|）で分割する
                //const cs = line.split('|')

                let chord_name = ''
                for (let j = 0; j < line.length; j++) {
                    
                    const c = line[j]
                    // C, D, E
                    if (MajorNoteName.includes(c)) {

                        const pitch = NoteName.indexOf(c)
                        chord_name = c
                        res.chords.push({
                            pitch: pitch,
                            chord_name: chord_name,
                            third: 'major',
                            tick: c_tick
                        })
                        c_tick += 8
                    }
                    // #
                    else if (c === '#') {
                        res.chords[res.chords.length - 1].pitch += 1
                        res.chords[res.chords.length - 1].chord_name += '#'
                    }
                    // m, M, sus4, dim, aug, add9
                    else if (c === 'm') {
                        res.chords[res.chords.length - 1].chord_name += 'm'
                        res.chords[res.chords.length - 1].third = 'minor'
                    }

                    // 6, 7, 9
                    

                    // on


                    // C, D, E


                    // #
                    

                }
            }
            // メロディ
            else if (line[0] === 'm') {
                // メロディのスケールを取得する
                const base_scale :number = NoteName.indexOf(res.scale)
                // 基準となるピッチ
                const base_pitch :number = 12 * 5 + base_scale

                for (let j = 0; j < line.length; j++) {

                    const c = line[j]
                    // 次のノートを一オクターブ上げる
                    if (c === '+') {
                        octarve = 1
                    }
                    // 次のノートを一オクターブ下げる
                    else if (c === '-') {
                        octarve = -1
                    }
                    // 前のノートを半音上げる
                    else if (c === '-') {
                        res.notes[res.notes.length - 1].pitch += 1
                    }
                    // mの時は無視
                    else if (c === 'm') {
                        
                    }
                    // 前のノート（or休符）を適当な数連続させる特殊文字（ワイルドカード）
                    else if (c === '*'){
                        kome_cnt += 1
                        // 次の小節まで一旦先にイテレートして、判断する
                        let dc = dur_cnt
                        let k = i + 1
                        while (line[k] !== '|' && k < line.length){
                            let cc = line[k]
                            if(cc === '.' || cc === '_' || !isNaN(Number(cc))){
                                dc += 1
                            }
                            k += 1
                        }
                        let dur = 8 - dc
                        if (dur < 0) dur = 0
                        // 前のノートに対して操作を加える
                        if (is_note) {
                            res.notes[res.notes.length - 1].duration += dur
                        }
                        dur_cnt += dur
                        tick += dur * reso
                        
                    }
                    // 小節の区切り文字
                    else if (c === '|'){
                        if (mea !== 0 && dur_cnt !== 8 && kome_cnt === 0) {
                            res.errMsg += `${mea}小節の音節が拍子と一致しません。（${dur_cnt}）\n`
                        }
                        if (kome_cnt > 1 ){
                            res.errMsg += `${mea}小節でワイルドカードが2回以上使用されています。 \n`
                        }
                        mea += 1
                        dur_cnt = 0
                        kome_cnt = 0
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
                        res.notes[res.notes.length - 1].duration += 1
                        dur_cnt += 1
                        tick += reso
                    }
                    // 数値であればnoteとして認識する
                    else if (!isNaN(Number(c))) {
                        const pitch = MajorScale[Number(c)] + base_pitch + octarve * 12
                        const pitch_name = Lib.noteNumberToNoteName(pitch)

                        res.notes.push({
                            pitch: pitch,
                            pitch_name: pitch_name,
                            duration: 1,
                            channel: 0,
                            velocity: 100,
                            mea: mea,
                            tick: tick
                        })
                        tick += reso
                        octarve = 0
                        dur_cnt += 1
                        is_note = true
                    }
                    else {
                        // エラー
                        res.errMsg += `${i+1}行${j+1}文字目: 予期せぬ文字列「${c}」です。\n`
                    }
                }
            }
        }
    })

    res.mea = mea
    // console.clear()
    console.log(res)
    return res

}