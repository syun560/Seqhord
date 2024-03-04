import { Res } from '../types.ts'
import { compile_drum } from './compile_drum.ts'
import { compile_bass } from './compile_bass.ts'
import { compile_append } from './compile_append.ts'
import { compile_lyric } from './compile_lyric.ts'
import { compile_melody } from './compile_melody.ts'
import { compile_chord } from './compile_chord.ts'
import { compile_var } from './compile_var.ts'

// 自作音楽記述言語のコンパイル
export const compile = (texts: string[]) => {
    let res :Res = {
        title: "none",
        bpm: 120,
        scales: [],
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
                res.scales.push({
                    mea: p_mea,
                    tick: p_mea * 8,
                    scale: t
                })
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
            // 歌詞
            else if (line[0] === 'k') {

            }
            // 伴奏
            else if (line[0] === 'a') {
                compile_var(line, i , res, 1)
            }
            // ベース
            else if (line[0] === 'b') {
                compile_var(line, i, res, 2)
            }
            // ドラム
            else if (line[0] === 'd') {
                compile_var(line, i, res, 3)
            }
        }
    })

    res.mea = mea

    // 変数を含むトラックをコンパイルする
    compile_append(texts, res, 1)
    compile_bass(texts, res, 2)
    compile_drum(texts, res.vars, res.notes, 3)

    // console.clear()
    console.log(res)
    return res

}