import { Note } from './types.ts'

const NoteName = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

// 自作音楽記述言語のコンパイル
export const compile = (text: string) => {

    // 文字列を改行ごとに分割して配列に入れる
    const lines = text.split('\n')
    const tmp_notes:Note[] = []
    let tick = 0
    let reso = 480
    let errMsg = ''
    let title = 'none'
    let scale = 'C'
    let bpm = 120
    let octarve = 0

    // 文字列を検索する
    lines.forEach((line, i) => {
        // 行数制限
        if (i > 500) {
            errMsg += '入力可能な最大行数(500行)を超えています。コンパイルを中止します。\n'
            return
        }

        // @キーワード
        if (line.indexOf('@') !== -1) {
            // BPM
            if (line.indexOf('b') !== -1) {
                const i = line.indexOf('=')
                const b = Number(line.slice(i + 1))
                bpm = b
            }
            // タイトル
            else if (line[1] === 't') {
                const i = line.indexOf('=')
                const t = line.slice(i + 1)
                title = t
            }
            // スケール（調）
            else if (line[1] === 's') {
                const i = line.indexOf('=')
                const t = line.slice(i + 1)
                scale = t
            }
        }
        else{
            // コード
            if (line[0] === 'c') {

            }
            // メロディ
            else if (line[0] === 'm') {
                // オクターブピッチを取得する
                const base_pitch :number = Number(line[1])
                // メロディのスケールを取得する
                const base_scale :number = NoteName.indexOf(scale)

                for (let i = 0; i < line.length; i++) {

                    const c = line[i]
                    // 次のノートを一オクターブ上げる
                    if (c === '+') {
                        octarve = 1
                    }
                    // 次のノートを一オクターブ下げる
                    else if (c === '-') {
                        octarve = -1
                    }
                    // 前のノートを伸ばす
                    else if (c === '_') {
                        // 配列の最後の要素に対して操作
                        tmp_notes[tmp_notes.length - 1].duration = 'T8'
                    }
                    // 数値であればnoteとして認識する
                    else if (!isNaN(Number(c))) {
                        const note = Number(c)
                        console.log(note)
                        const note_name = ''

                        tmp_notes.push({
                            pitch: note_name + String(base_pitch),
                            duration: 'T4',
                            channel: 0,
                            velocity: 100,
                            tick: tick
                        })
                        tick += reso
                        octarve = 0
                    }
                    else {
                        // エラー
                        errMsg += `${i}行目: 予期せぬ文字列「${c}」です。\n`
                    }
                }
            }
        }
    })

}