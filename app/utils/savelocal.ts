import { Track } from 'types'

// ローカルに保存する
export function savelocal(tracks: Track[]) {

    // 複数トラックのテキストを一つのテキストにする。
    const text = tracks.map(t => t.texts).join("\n@end\n")
    console.log(text)

    // localStorage.setItem('first', String(val))
    if (!localStorage) {
        console.error("localstorage非対応")
        return
    }
    
    let val = localStorage.getItem('first')
    if (val === null) val = "true"        
}