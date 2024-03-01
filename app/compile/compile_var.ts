import { Res } from '../types.ts'

// 変数を認識し、コンパイルする（現在はドラムのみ想定）
export const compile_var = (line: string, i: number, res: Res, c: number) => {
    // 順番に解釈していく
    let d_state = 0 // 0: 変数認識, 1:アスタリスク, 2:回数認識受付状態
    let tmp_var = '' // 変数の名前
    let mea = res.mea

    for (let j = 1; j < line.length; j++) {
        
        const c = line[j]
        // 
        if (c === '*') {
            d_state = 1
            res.vars.push({
                tick: mea * 8,
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
                    tick: mea * 8,
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