import { Res } from '../types.ts'

// 変数を認識し、コンパイルする（現在はドラムのみ想定）
export const compile_lyric = (line: string, i: number, res: Res) => {

    let reso = 1
    
    let mea = res.mea
    let tick = mea * 8

    let isSeq = false // 前の歌詞と連続しているかどうか

    let kashi = '' // 一時的に歌詞を入れる変数（基本的に一文字）

    for (let j = 1; j < line.length; j++) {

        const c = line[j]
        // 小節線
        if (c === '|'){
            if (j !== 1) mea += 1
        }
        // 前の歌詞に連続させる
        else if (c === '^') {
            isSeq = true
        }
        else if (c === '+' || c === '-' || c === '*' || c === '-'){
            // エラー
            res.errMsg += `${i+1}行${j+1}文字目: 予期せぬ文字列「${c}」です。\n`
        }
        // その他すべて歌詞として認識する
        else {
            // 同じ場所のNoteを検索する
            const fi = res.notes[0].findIndex(f=>f.tick === tick)

            // 同じ場所にNoteがあれば、入れる
            if (fi !== -1) {
                if (isSeq) {
                    res.notes[0][fi - 1].lyric += c
                }
                else {
                    res.notes[0][fi].lyric = ''
                    res.notes[0][fi].lyric += c
                }
                tick += reso
            }
        }
    }
}