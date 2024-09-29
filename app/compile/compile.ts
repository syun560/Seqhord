import { Res , Track_Info, Var2 } from '../types.ts'
import { expand_vars } from './expand_vars.ts'
import { compile_lyric } from './compile_lyric.ts'
import { compile_melody } from './compile_melody.ts'
import { compile_chord } from './compile_chord.ts'
import { compile_var } from './compile_var.ts'

// 自作音楽記述言語のコンパイル
export const compile = (tracks: Track_Info[]) => {
    const start_time = performance.now()

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
            program: 0,
            ch: i,
            type: 'conductor',
            trans: 5,
            notes: [],
            texts: tracks[i].texts,
            volume: 100,
            panpot: 64
        })
    }
    
    // 変数のコンパイルを行う
    let vars2:Var2[] = []
    compile_var(tracks, vars2, res)
    res.tracks[0].name = 'main'
    res.tracks[0].type = 'conductor'
    // console.log(vars2)

    // 文字列を改行ごとに分割して配列に入れる
    const lines = tracks[0].texts.split('\n')
    let p_mea = 0 // パラグラフが始まる前のmea
    let mea = 0

    // console.log(res)

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
                res.bpm = Number(line.slice(line.indexOf('=') + 1))
            }
            else if (line.indexOf('type') !== -1){

            }
            else if (line.indexOf('trans') !== -1){
                res.tracks[0].trans = Number(line.slice(line.indexOf('=') + 1))
            }
            // タイトル
            else if (line.indexOf('title') !== -1) {
                res.title = line.slice(line.indexOf('=') + 1)
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
                res.tracks[0].program = Number(line.slice(line.indexOf('=') + 1))
            }
            else if (line.indexOf('volume') !== -1) {
                res.tracks[0].volume = Number(line.slice(line.indexOf('=') + 1))
            }
            // パラグラフ
            else if (line.indexOf('p') !== -1){
                p_mea = Number(line.slice(line.indexOf('=') + 1))
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
            // 数値の場合は別のトラック
            else if (!isNaN(Number(line[0]))) {
                const t = Number(line[0])
                if (t < tracks.length) {
                    expand_vars(line, res, t, vars2)
                }
            }
        }
    })

    res.mea = mea
    // console.log(res)
 
    // 実行時間を計測
    const end_time = performance.now()
    let time = (end_time - start_time) * 10
    time = Math.round(time)
    time = time / 10

    res.errMsg += `compile complete...(${time} ms)\n`
    return res
}