import { Track_Info, Var } from '../types.ts'

// 変数を認識し、コンパイルする（現在はドラムのみ想定）
export const compile_var2 = (tracks: Track_Info[], vars: Var[]) => {
    // すべてのトラックのテキストをイテレート
    tracks.forEach(track=>{

        
    //     // typeを把握する
    //     const type = 'append'

    //     // 文字列を改行ごとに分割して配列に入れる
    //     const lines = track.texts.split('\n')

    //     let reso = 0.5
    //     let dur_cnt = 0 // 1小節をカウントする

    //     // ベースノートを生成する
    //     // 文字列を検索する
    //     lines.forEach((l, i) => {
    //         // 空白文字の削除
    //         const line = l.replace(/\s+/g, "")

    //         let tick = 0

    //     // @キーワード
    //     if (line.indexOf('@') !== -1) {            
    //         // tmp_notesの追加
    //         if (line.indexOf('n') !== -1) {

    //             const i = line.indexOf('=')
    //             const b = line.slice(i + 1)
    //             // b_notes.push({
    //             //     name: b,
    //             //     notes: []
    //             // })
    //             tick = 0
    //         }
    //         if (line[1] === 'e') {
    //             // b_notes[b_notes.length - 1].notes = [...tmp_notes]
    //             // tmp_notes = []
    //         }
    //     }
    //     else{
    //         // コメント
    //         if (line[0] === '#') { }
    //         // ノート
    //         else if (line[0] === 'b') {
    //             tick = 0
    //             const p = line[0]

    //             // 一文字目を飛ばして行をイテレート開始

    //             for (let j = 1; j < line.length; j++) {
    //                 const c = line[j]
                    
    //                 // 小節の区切り文字
    //                 if (c === '|'){
    //                 }
                    
    //                 // 休符
    //                 else if (c === '.'){
    //                     tick += reso
    //                     dur_cnt += 1
    //                     is_note = false
    //                 }
                    
    //                 // 前のノートを伸ばす
    //                 else if (c === '_') {
    //                     // 配列の最後の要素に対して操作
    //                     tmp_notes[tmp_notes.length - 1].duration += reso
    //                     dur_cnt += 1
    //                     tick += reso
    //                 }
                    
    //                 // 数値であればnoteとして認識する
    //                 else if (!isNaN(Number(c))) {
    //                     // const pitch = MajorScale[Number(c)] + base_pitch + octarve * 12
    //                     const pitch = MajorScale[Number(c)]
    //                     const pitch_name = Lib.noteNumberToNoteName(pitch)

    //                     tmp_notes.push({
    //                         pitch: pitch,
    //                         pitch_name: pitch_name,
    //                         duration: reso,
    //                         channel: 2,
    //                         velocity: 100,
    //                         mea: 0,
    //                         tick: tick
    //                     })
    //                     tick += reso
    //                     octarve = 0
    //                     dur_cnt += 1
    //                     is_note = true
    //                 }
    //                 else {
    //                     // エラー
    //                     res.errMsg += `${i+1}行${j+1}文字目(ch: ${ch}): 予期せぬ文字列「${c}」です。\n`
    //                 }
    //             }
    //         }
    //     }
    // })


        // 変数を認識する
        vars.push()
    })
}