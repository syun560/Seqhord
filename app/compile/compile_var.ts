import { Track, Note, Res } from '../types.ts'
import Lib from '../Lib.ts'

const MajorScale = [0, 0, 2, 4, 5, 7, 9, 11, 12]

// 連想配列のインタフェース
interface DrumProgram {  [key: string]: number }
const program: DrumProgram = { k: 35, s: 38, h: 42, c: 49 }

// 変数を認識し、コンパイルする
export const compile_var = (tracks: Track[], res: Res) => {
    
    // すべてのトラックのテキストをイテレート
    tracks.forEach((track, t) => {
        if (t === 0) return

        // 文字列を改行ごとに分割して配列に入れる
        const lines = track.texts.split('\n')

        let reso = 0.5
        let octarve = 0
        let dur_cnt = 0 // 1小節をカウントする

        let tmp_notes: Note[] = []
        let max_tick = 0

        // ベースノートを生成する
        // 文字列を検索する
        lines.forEach((l, i) => {
            // 空白文字の削除
            const line = l.replace(/\s+/g, "")
            let tick = 0

            // @キーワード
            if (line.indexOf('@') !== -1) {

                // tmp_notesの追加
                if (line.indexOf('name') !== -1 ) {
                    res.tracks[t].name = line.slice(line.indexOf('=') + 1)
                }
                else if (line.indexOf('type') !== -1 ) {
                    res.tracks[t].type = line.slice(line.indexOf('=') + 1)
                    if (res.tracks[t].type === 'drum') res.tracks[t].ch = 9
                }
                else if (line.indexOf('trans') !== -1 ) {
                    res.tracks[t].trans = Number(line.slice(line.indexOf('=') + 1))
                }
                else if (line.indexOf('reso') !== -1) {
                    res.tracks[t].trans = Number(line.slice(line.indexOf('=') + 1))
                }
                // プログラムチェンジ
                else if (line.indexOf('program') !== -1) {
                    res.tracks[t].program = Number(line.slice(line.indexOf('=') + 1))
                }
                // ボリューム
                else if (line.indexOf('volume') !== -1) {
                    res.tracks[t].volume = Number(line.slice(line.indexOf('=') + 1))
                }
                // パンポット
                else if (line.indexOf('panpot') !== -1) {
                    res.tracks[t].panpot = Number(line.slice(line.indexOf('=') + 1))
                }
                else if (line[1] === 'n') {
                    res.vars.push({
                        name: line.slice(line.indexOf('=') + 1),
                        notes: [],
                        len: 8
                    })
                    tick = 0
                }
                if (line[1] === 'e') {
                    res.vars[res.vars.length - 1].notes = [...tmp_notes]
                    res.vars[res.vars.length - 1].len = max_tick
                    tmp_notes = []
                }
            }
            else {
                // コメント
                if (line[0] === '#') { }
                // ノート
                else if (line[0] === 'n') {
                    tick = 0
                    const p = line[0]

                    // 一文字目を飛ばして行をイテレート開始
                    for (let j = 1; j < line.length; j++) {
                        const c = line[j]

                        // 小節の区切り文字
                        if (c === '|') {  }

                        // 休符
                        else if (c === '.') {
                            tick += reso
                            dur_cnt += 1
                        }

                         // 次のノートを一オクターブ上げる
                        else if (c === '+') {
                            octarve += 1
                        }
                        // 次のノートを一オクターブ下げる
                        else if (c === '-') {
                            octarve -= 1
                        }
                        // 前のノートを半音上げる
                        else if (c === '#') {
                            tmp_notes[tmp_notes.length - 1].pitch += 1
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
                            const pitch = MajorScale[Number(c)] + octarve * 12
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
                        }
                        else {
                            // エラー
                            // console.log(`${i + 1}行${j + 1}文字目(Track: ${t}): 予期せぬ文字列「${c}」です。\n`)
                        }
                    }
                }
                else if (line[0] === 'c' || line[0] === 'h' || line[0] === 's' || line[0] === 'k') {
                    tick = 0
                    const p = line[0]
                    for (let j = 1; j < line.length; j++) {
                        const c = line[j]
                        // 小節の区切り文字
                        if (c === '|'){
                        }
                        else if (c === 'x') {
                            tmp_notes.push({
                                pitch: program[p],
                                pitch_name: 'drum',
                                duration: 1,
                                channel: 0,
                                velocity: 100,
                                mea: 0,
                                tick
                            })
                            tick += 0.5
                        }
                        else if (c === 'o') { // オープンハイハット
                            tmp_notes.push({
                                pitch: 46,
                                pitch_name: 'Open Hi-Hat',
                                duration: 1,
                                channel: 0,
                                velocity: 100,
                                mea: 0,
                                tick
                            })
                            tick += 0.5
                        }
                        else if (c === '.') {
                            tick += 0.5
                        }
                    }
                }
            }

            max_tick = tick
        })

        // 変数を認識する
        //vars.push()
    })
}