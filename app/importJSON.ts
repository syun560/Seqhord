import { ChangeEvent } from 'react'

export const loadJSON = (e: ChangeEvent<HTMLInputElement>, setTracks: any) => {
    if (!e.target.files || e.target.files.length === 0) {
        console.error('ファイルを選択して下さい')
        return
    }

    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = event => {
        const content = event.target?.result
        try {
            const jsonData = JSON.parse(content as string)
            console.log(jsonData)
            setTracks(jsonData)
        } catch (error) {
            console.error('JSONファイルを解析できませんでした。', error)
        }
    }

    
    reader.readAsText(file)
}
