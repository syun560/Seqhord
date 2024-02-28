import { Var, Note } from './types.ts'

// ドラムノーツ
type DNotes = {
    name: string
    notes: Note[]
}

// 変数を認識し、コンパイルする（現在はドラムのみ想定）
export const compile_var = (texts: string[], vars: Var[], notes: Note[][], c: number) => {
    // 譜面のあれを認識する
    // texts[c]

    // 文字列を改行ごとに分割して配列に入れる
    const lines = texts[c].split('\n')

    // noteを用意する
    const d_notes: DNotes[] = []
    
    // 文字列を検索する
    lines.forEach((l, i) => {
        // 空白文字の削除
        const line = l.replace(/\s+/g, "")

        // @キーワード
        if (line.indexOf('@') !== -1) {
            // BPM
            if (line.indexOf('n') !== -1) {
                const i = line.indexOf('=')
                const b = Number(line.slice(i + 1))
                //res.bpm = b
            }
        }
    })

    // noteをプッシュする
    notes[c].push({
        pitch: 35,
        pitch_name: 'drum',
        duration: 1,
        channel: 10,
        velocity: 100,
        mea: 1,
        tick: 0
    })
}