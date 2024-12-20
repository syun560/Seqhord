import { Res , Track, Var2 } from '../types.ts'
import { expand_vars } from './expand_vars.ts'
import { compile_lyric } from './compile_lyric.ts'
import { compile_melody } from './compile_melody.ts'
import { compile_chord } from './compile_chord.ts'
import { compile_var } from './compile_var.ts'

// compile SMML
export const compile = (tracks: Track[]) => {
    const start_time = performance.now()

    let res :Res = {
        title: "none",
        bpm: 120,
        scales: [],
        errMsg: "",
        tick: 8,
        vars: [],
        tracks: [],
        chords: [],
    }
    
    // init 2d array
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
    compile_var(tracks, res)
    res.tracks[0].name = 'main'
    res.tracks[0].type = 'conductor'

    // 文字列を改行ごとに分割して配列に入れる
    const lines = tracks[0].texts.split('\n')
    // console.log(lines)
    let next_tick = res.tick

    // search strings
    lines.forEach((l, i) => {
        // 空白文字の削除
        const line = l.replace(/\s+/g, "");

        // 空行の場合は次のtickへ進む
        if (line === "") res.tick = next_tick

        // console.log("------")
        // console.log("res.tick: ", res.tick)
        // console.log("line: ", line)

        // restrict max rows
        if (i > 1000) {
            res.errMsg += '入力可能な最大行数(1000行)を超えています。コンパイルを中止します。\n'
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
                    tick: res.tick,
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
                // p_mea = Number(line.slice(line.indexOf('=') + 1))
                // res.mea = p_mea
            }
        }
        else{
            if (line[0] === '#') { }
            else if (line[0] === 'c') compile_chord(line, i, res, 0)
            else if (line[0] === 'n') next_tick = compile_melody(line, i, res, 0, res.tracks[0].trans)                
            else if (line[0] === 'k') compile_lyric(line, i, res)

            // 数値の場合は別のトラック
            else if (!isNaN(Number(line[0]))) {
                const t = Number(line[0])
                if (t < tracks.length) {
                    const n = expand_vars(line, res, t)
                    if (n > next_tick) next_tick = n
                }
            }
        }
    })
 
    // 実行時間を計測
    const end_time = performance.now()
    let time = (end_time - start_time) * 10
    time = Math.round(time)
    time = time / 10

    res.errMsg += `compile complete...(${time} ms)\n`
    return res
}