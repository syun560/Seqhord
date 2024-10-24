import { json } from 'stream/consumers'
import { Chord, Track } from 'types'
import { compile } from './compile/compile'

export const loadJSON = (files: any, setTracks: (tracks: Track[])=>void ,setBPM: (bpm: number)=> void) => {
    if (!files || files.length === 0) {
        console.error('ファイルを選択して下さい')
        return
    }
    const file = files[0]

    const reader = new FileReader()
    reader.onload = event => {
        const content = event.target?.result
        try {
            const jsonData = JSON.parse(content as string) as Track[]
            setTracks(jsonData)
            const res = compile(jsonData)
            setBPM(res.bpm)
        } catch (error) {
            console.error('SMMLファイルを解析できませんでした。', error)
        }
    }
    
    reader.readAsText(file)
}
