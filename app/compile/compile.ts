import { Note, Chord, Var, Res } from '../types.ts'
import { compile_var } from './compile_var.ts'
import { compile_melody } from './compile_melody.ts'
import { compile_chord } from './compile_chord.ts'

// 自作音楽記述言語のコンパイル
export const compile = (texts: string[]) => {
    let res :Res = {
        title: "none",
        bpm: 120,
        scale: 'C',
        errMsg: "",
        mea: 0,
        notes: [],
        chords: [],
        vars: []
    }
    // 文字列を改行ごとに分割して配列に入れる
    const lines = texts[0].split('\n')
    let p_mea = 0 // パラグラフが始まる前のmea
    let mea = 0

    // 2次元配列の初期化
    res.notes[0] = []
    res.notes[1] = []
    res.notes[2] = []
    res.notes[3] = []

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
            if (line.indexOf('bpm') !== -1) {
                const i = line.indexOf('=')
                const b = Number(line.slice(i + 1))
                res.bpm = b
            }
            // タイトル
            else if (line.indexOf('title') !== -1) {
                const i = line.indexOf('=')
                const t = line.slice(i + 1)
                res.title = t
            }
            // スケール（調）
            else if (line.indexOf('scale') !== -1) {
                const i = line.indexOf('=')
                const t = line.slice(i + 1)
                res.scale = t
            }
            // プログラムチェンジ
            else if (line.indexOf('program') !== -1) {
                const i = line.indexOf('=')
                const t = line.slice(i + 1)
                //res.scale = t
            }
            // パラグラフ
            else if (line.indexOf('p') !== -1){
                const i = line.indexOf('=')
                const t = line.slice(i + 1)
                p_mea = Number(t)
                res.mea = p_mea
            }
        }
        else{
            // コメント
            if (line[0] === '#') {
            }
            // コード
            else if (line[0] === 'c') {
                compile_chord(line, i, res, 0)
            }
            // メロディ
            else if (line[0] === 'm') {
                compile_melody(line, i, res, 0)                
            }
            // ベース
            else if (line[0] === 'b') {
                
            }
            // ドラム
            else if (line[0] === 'd') {
                // 順番に解釈していく
                let d_state = 0 // 0: 変数認識, 1:アスタリスク, 2:回数認識受付状態
                let tmp_var = '' // 変数の名前
                for (let j = 1; j < line.length; j++) {
                    
                    const c = line[j]
                    // 
                    if (c === '*') {
                        d_state = 1
                        res.vars.push({
                            tick: p_mea * 8,
                            name: tmp_var,
                            repeat: 1
                        })
                        tmp_var = ''
                    }
                    // 数値であれば繰り返し回数として認識する
                    else if (!isNaN(Number(c))) {
                        if (d_state === 1) {
                            res.vars[res.vars.length - 1].repeat = Number(c)
                            d_state = 2
                        }
                        else if (d_state === 2) {
                            res.vars[res.vars.length - 1].repeat *= 10
                            res.vars[res.vars.length - 1].repeat += Number(c)
                            d_state = 2
                        }
                    }
                    else if (c === '|'){
                        if (tmp_var !== '') {
                            d_state = 0
                            res.vars.push({
                                tick: p_mea * 8,
                                name: tmp_var,
                                repeat: 1
                            })
                            tmp_var = ''
                        }
                    }
                    else {
                        d_state = 0
                        tmp_var += c
                    }
                }
            }
        }
    })

    res.mea = mea

    // varをコンパイルする
    compile_var(texts, res.vars, res.notes, 2)

    // console.clear()
    console.log(res)
    return res

}