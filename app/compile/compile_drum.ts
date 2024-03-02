import { Var, Note } from '../types.ts'

// ドラムパターン
type DNote = {
    name: string
    notes: Note[]
}

// 連想配列のインタフェース
interface Program {
    [key: string]: number
}

// 変数を認識し、コンパイルする（現在はドラムのみ想定）
export const compile_drum = (texts: string[], vars: Var[], notes: Note[][], c: number) => {
    // 文字列を改行ごとに分割して配列に入れる
    const lines = texts[c].split('\n')

    // noteを用意する
    const d_notes: DNote[] = []
    let tmp_notes: Note[] = []

    const program: Program = {
        k: 35,
        s: 38,
        h: 42,
        c: 49
    }

    // 文字列を検索する
    lines.forEach((l, i) => {
        // 空白文字の削除
        const line = l.replace(/\s+/g, "")

        let tick = 0

        // @キーワード
        if (line.indexOf('@') !== -1) {            
            // tmp_notesの追加
            if (line.indexOf('n') !== -1) {

                const i = line.indexOf('=')
                const b = line.slice(i + 1)
                d_notes.push({
                    name: b,
                    notes: []
                })
                tick = 0
            }
            if (line[1] === 'e') {
                d_notes[d_notes.length - 1].notes = [...tmp_notes]
                tmp_notes = []
            }
        }
        else{
            // コメント
            if (line[0] === '#') { }
            // ノート
            else if (line[0] === 'c' || 'h' || 's' || 'k') {
                tick = 0
                const p = line[0]
                for (let j = 1; j < line.length; j++) {
                    const c = line[j]
                    // 小節の区切り文字
                    if (c === '|'){
                    }
                    else if (c === 'x') {
                        tmp_notes.push({
                            pitch: program[p],
                            pitch_name: 'drum',
                            duration: 1,
                            channel: 0,
                            velocity: 100,
                            mea: 0,
                            tick: tick
                        })
                        tick += 0.5
                    }
                    else if (c === '.') {
                        tick += 0.5
                    }
                }
            }
        }
    })

    console.log(d_notes)

    // varsをイテレートし、noteを生成する。
    vars.forEach(v=>{
        const dn = d_notes.find(d=> d.name === v.name)
        if (dn !== undefined) {

            // tickをずらしたパターンを作る
            let pattern = dn.notes.map(d=>{
                return {
                    pitch: d.pitch,
                    pitch_name: 'drum',
                    duration: 1,
                    channel: 10,
                    velocity: 100,
                    mea: 1,
                    tick: d.tick + v.tick
                }
            })

            // 繰り返しぶん配列を複製する
            let pattern2 = [...pattern]
            for (let i = 1; i < v.repeat ; i++) {
                pattern2.push(...pattern.map(p=>{
                    return {
                        pitch: p.pitch,
                        pitch_name: 'drum',
                        duration: 1,
                        channel: 10,
                        velocity: 100,
                        mea: 1,
                        tick: p.tick + i * 8
                    }
                }))
            }

            notes[c].push(...pattern2)
        }
    })
}