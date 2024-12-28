import { Track } from 'types'
import { compile } from './compile/compile'

export const loadJSON = (files: any, setTracks: (tracks: Track[])=>void ,setBPM: (bpm: number)=> void, setCompile: (tracks: Track[])=>void) => {
    if (!files || files.length === 0) {
        console.error('ファイルを選択して下さい')
        return
    }
    const file = files[0]

    const reader = new FileReader()

    // 読み込み終了後に実行される処理
    reader.onload = event => {
        const content = event.target?.result
        try {
            const jsonData = JSON.parse(content as string) as Track[]
            // setTracks(jsonData)
            setCompile(jsonData)
        } catch (error) {
            console.error('SMMLファイルを解析できませんでした。', error)
        }
    }
    
    // 読み込み実行処理
    reader.readAsText(file)
}
