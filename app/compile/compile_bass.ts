import { Chord, Note } from '../types.ts'

// 変数を認識し、コンパイルする（現在はドラムのみ想定）
export const compile_bass = (texts: string[], chord: Chord[], notes: Note[][], c: number) => {
    // 譜面のあれを認識する
    // texts[c]

    // 文字列を改行ごとに分割して配列に入れる
    const lines = texts[c].split('\n')

    // ベースノートを生成する
    
}