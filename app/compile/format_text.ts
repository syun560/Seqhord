import { clearLine } from 'readline'
import { Track } from '../types.ts'

// 全角文字を考慮した幅を計算する関数
function getCellWidth(text :string) {
    return text.split('').reduce((width, char) => {
        return width + (char.match(/[\u3000-\u9FFF\uFF01-\uFF60]/) ? 2 : 1)
    }, 0)
}

// 整形する
export const format_text = (texts: string) => {

    const lines = texts.split('\n')

    // 各小節の最大文字数
    let max_strings: number[] = []
    // 整形後の文字列
    let formated_text: string = ""
    
    // 文字列カウント部分と、文字列整形のため、2回イテレートする
    for (let loop = 1; loop <= 2; loop++){

        // 分割して各行を配列にする
        let mea_number = 0
        let next_mea = 0
        let row_mea = 0

        lines.forEach((line, row) => {

            // 空行の場合は次のlineへ進む
            if (line === "") {
                mea_number = next_mea
                row_mea = next_mea
                if (loop === 2) formated_text += '\n' 
                return
            }

            if (line[0] !== 'c' && line[0] !== 'n' && line[0] !== 'k') {
                if (loop === 2) formated_text += line + '\n' 
                return
            }

            mea_number = row_mea

            // 文字列を小節線ごとに分割して配列に入れる
            const meas = line.split('|')
            
            meas.forEach((mea, i) => {
                if (i === 0) {
                    if (loop === 2) formated_text += mea
                    return
                } 
                const cellContent = mea.trim()
                const cellWidth = getCellWidth(cellContent)

                // 1回目のループ（文字長カウント）
                if (loop === 1) {
                    if (max_strings.length <= mea_number) {
                        max_strings.push(cellWidth)
                    }else{
                        if (max_strings[mea_number] < cellWidth) {
                            max_strings[mea_number] = cellWidth
                        }
                    }
                }
                // 2回目のループ（文字列整形）
                else {
                    const padding = max_strings[mea_number] - cellWidth + 1
                    const t = cellContent + ' '.repeat(padding)
                    formated_text += '|' + t
                }

                mea_number += 1
                next_mea = mea_number
            })
            if (loop === 2) formated_text += '\n'
        })
    }

    // console.log(formated_text)
    // console.log(max_strings)

    return formated_text
}