import { Res } from '../types.ts'
import Lib from '../Lib.ts'

const MajorScale = [0, 0, 2, 4, 5, 7, 9, 11, 12]
const NoteName = ['C','C#', 'D', 'D#','E', 'F', 'F#','G', 'G#','A', 'A#','B']

// 変数を認識し、コンパイルする（現在はドラムのみ想定）
export const compile_melody = (line: string, i: number, res: Res, c: number) => {
    // メロディのスケールを取得する
    const base_scale :number = NoteName.indexOf(res.scales[res.scales.length - 1].scale)

    console.log(`base_scale(melody): ${base_scale}`)

    // 基準となるピッチ
    const base_pitch :number = 12 * 5 + base_scale


    let reso = 1
    let octarve = 0
    let dur_cnt = 0 // 1小節をカウントする
    let is_note = false // 休符かnoteか

    let mea = res.mea
    let tick = mea * 8

    for (let j = 1; j < line.length; j++) {

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
            res.notes[0][res.notes[0].length - 1].pitch += 1
        }
        // 小節線
        else if (c === '|'){
            if (j !== 1 && dur_cnt !== 8) {
                res.errMsg += `${mea}小節の音節が拍子と一致しません。（${dur_cnt}）\n`
            }
            if (j !== 1) mea += 1
            dur_cnt = 0
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
            res.notes[0][res.notes[0].length - 1].duration += 1
            dur_cnt += 1
            tick += reso
        }
        // 数値であればnoteとして認識する
        else if (!isNaN(Number(c))) {
            const pitch = MajorScale[Number(c)] + base_pitch + octarve * 12
            const pitch_name = Lib.noteNumberToNoteName(pitch)

            res.notes[0].push({
                pitch: pitch,
                pitch_name: pitch_name,
                duration: 1,
                channel: 1,
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