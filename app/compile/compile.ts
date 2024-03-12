import { Res , Track_Info, Var2 } from '../types.ts'
import { expand_vars } from './expand_vars.ts'
import { compile_lyric } from './compile_lyric.ts'
import { compile_melody } from './compile_melody.ts'
import { compile_chord } from './compile_chord.ts'
import { compile_var2 } from './compile_var2.ts'


// 自作音楽記述言語のコンパイル
export const compile = (tracks: Track_Info[]) => {
    let res :Res = {
        title: "none",
        bpm: 120,
        scales: [],
        errMsg: "",
        mea: 0,
        tracks: [],
        chords: [],
    }
    // 2次元配列の初期化
    for (let i = 0; i < tracks.length; i++) {
        res.tracks.push({
            name: `Track${i}`,
            ch: i,
            type: 'conductor',
            trans: 5,
            notes: [],
            texts: tracks[i].texts,
        })
    }
    
    // 変数のコンパイルを行う
    let vars2:Var2[] = []
    compile_var2(tracks, vars2, res)
    res.tracks[0].name = 'main'
    res.tracks[0].type = 'conductor'
    console.log(vars2)

    // 文字列を改行ごとに分割して配列に入れる
    const lines = tracks[0].texts.split('\n')
    let p_mea = 0 // パラグラフが始まる前のmea
    let mea = 0

    console.log(res)

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
            else if (line.indexOf('type') !== -1){

            }
            else if (line.indexOf('trans') !== -1){
                const i = line.indexOf('=')
                const b = Number(line.slice(i + 1))
                res.tracks[0].trans = b
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
            else if (line[0] === 'n') {
                compile_melody(line, i, res, 0, res.tracks[0].trans)                
            }
            // 歌詞
            else if (line[0] === 'k') {
                compile_lyric(line, i, res)
            }
            // 伴奏
            else if (line[0] === '1') {
                expand_vars(line, res, 1, vars2)
            }
            // ベース
            else if (line[0] === '2') {
                expand_vars(line, res, 2, vars2)
            }
            // ドラム
            else if (line[0] === '3') {
                expand_vars(line, res, 3, vars2)
            }
        }
    })

    res.mea = mea
    console.log(res)

    return res
}