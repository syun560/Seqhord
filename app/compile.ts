import { Note } from './types.ts'

const NoteName = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
type Res = {
    title: string
    bpm: number
    scale: string
    errMsg: string
    notes: Note[]
}

// 自作音楽記述言語のコンパイル
export const compile = (text: string) => {
    let res :Res = {
        title: "none",
        bpm: 120,
        scale: 'C',
        errMsg: "",
        notes: []
    }

    // 文字列を改行ごとに分割して配列に入れる
    const lines = text.split('\n')
    const tmp_notes:Note[] = []
    let tick = 0
    let reso = 480
    let octarve = 0
    let mea = 0
    let dur_cnt = 0 // 1小節をカウントする
    let kome_cnt = 0 // 「*」の個数をカウントする。

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
            // コード
            if (line[0] === 'c') {

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
                    // mの時は無視
                    else if (c === 'm') {
                        
                    }
                    // 前のノートを連続させる
                    else if (c === '*'){
                        kome_cnt += 1
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
                    }
                    // 前のノートを伸ばす
                    else if (c === '_') {
                        // 配列の最後の要素に対して操作
                        res.notes[res.notes.length - 1].duration += 1
                        dur_cnt += 1
                    }
                    // 数値であればnoteとして認識する
                    else if (!isNaN(Number(c))) {
                        const pitch = Number(c) + base_pitch + octarve * 12
                        const pitch_name = ''

                        res.notes.push({
                            pitch: pitch,
                            pitch_name: pitch_name,
                            duration: 1,
                            channel: 0,
                            velocity: 100,
                            tick: tick
                        })
                        tick += reso
                        octarve = 0
                        dur_cnt += 1
                    }
                    else {
                        // エラー
                        res.errMsg += `${i+1}行${j+1}文字目: 予期せぬ文字列「${c}」です。\n`
                    }
                }
            }
        }
    })

    console.clear()
    console.log(res)
    return res

}