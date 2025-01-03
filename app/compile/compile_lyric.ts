import { Res } from '../types.ts'

// 歌詞を認識し、notes内に入れる
export const compile_lyric = (line: string, i: number, res: Res) => {

    let tick = res.tick

    let isSeq = false // 前の歌詞と連続しているかどうか
    let isComma = false // 区切り記号（,）があったかどうか

    // 現在のtickより大きい最初のnoteのインデックスを見つける
    let fi = res.tracks[0].notes.findIndex(n => n.tick >= tick)
    
    if (fi === -1) {
        res.errMsg += `there was no corresponding notes for lyrics (line: ${i})\n`
        return
    }

    for (let j = 1; j < line.length; j++) {
        const c = line[j]

        if (isComma === false && (c === 'ん' || c === 'ゃ' || c === 'ゅ' || c === 'ょ' || c === 'っ'|| c === 'ン' || c === 'ャ' || c === 'ュ' || c === 'ョ' || c === 'ッ')){
            isSeq = true
        }

        // 小節線
        if (c === '|'){
            // if (j !== 1) mea += 1
        }
        // 前の歌詞に連続させる
        else if (c === '^') {
            isSeq = true
        }
        else if (c === ',') {
            isComma = true
        }
        else if (c === '+' || c === '-' || c === '*' || c === '-'){
            // エラー
            res.errMsg += `${i+1}行${j+1}文字目: 予期せぬ文字列「${c}」です。\n`
        }
        // その他すべて歌詞として認識する
        else {
            if (fi >= res.tracks[0].notes.length && isSeq === false){
                res.errMsg += `The number of characters in the lyrics are exceeded (tick: ${tick})\n`
                return
            }

            // 同じ場所にNoteがあれば、入れる
                if (isSeq) {
                    res.tracks[0].notes[fi - 1].lyric += c
                }
                else {
                    res.tracks[0].notes[fi].lyric = ''
                    res.tracks[0].notes[fi].lyric += c
                    fi += 1
                }
                isSeq = false
                isComma = false
            }
    }
}