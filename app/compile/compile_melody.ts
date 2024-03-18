import { Res } from '../types.ts'
import Lib from '../Lib.ts'

const MajorScale = [0, 0, 2, 4, 5, 7, 9, 11, 12]
const NoteName = ['C','C#', 'D', 'D#','E', 'F', 'F#','G', 'G#','A', 'A#','B']

// 変数を認識し、コンパイルする
export const compile_melody = (line: string, i: number, res: Res, c: number, trans:number) => {
    // メロディのスケールを取得する
    const base_scale :number = NoteName.indexOf(res.scales[res.scales.length - 1].scale)

    // 基準となるピッチ
    const base_pitch :number = 12 * trans + base_scale


    let reso = 1
    let octarve = 0
    let dur_cnt = 0 // 1小節をカウントする
    let is_note = false // 休符かnoteか

    let mea = res.mea
    let tick = mea * 8

    const notes = res.tracks[0].notes

    for (let j = 1; j < line.length; j++) {

        const c = line[j]
        // 次のノートを一オクターブ上げる
        if (c === '+') {
            octarve += 1
        }
        // 次のノートを一オクターブ下げる
        else if (c === '-') {
            octarve -= 1
        }
        // 前のノートを半音上げる
        else if (c === '#') {
            notes[notes.length - 1].pitch += 1
        }
        // 前のノートのdurationを半分にする
        else if (c === '^'){
            const dur = reso/2
            notes[notes.length - 1].duration = reso / 2
            dur_cnt -= dur
            tick -= dur
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
            notes[notes.length - 1].duration += 1
            dur_cnt += 1
            tick += reso
        }
        // 数値であればnoteとして認識する
        else if (!isNaN(Number(c))) {
            const pitch = MajorScale[Number(c)] + base_pitch + octarve * 12
            const pitch_name = Lib.noteNumberToNoteName(pitch)
            const duration = reso

            notes.push({
                pitch: pitch,
                pitch_name: pitch_name,
                duration: duration,
                channel: 1,
                velocity: 100,
                mea: mea,
                tick: tick
            })
            tick += duration
            octarve = 0
            dur_cnt += duration
            is_note = true
        }
        else {
            // エラー
            res.errMsg += `${i+1}行${j+1}文字目: 予期せぬ文字列「${c}」です。\n`
        }
    }
}