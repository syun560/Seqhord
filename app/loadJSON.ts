import { Track } from 'types'

export const loadJSON = async (files: any) => {
    return new Promise((resolve, reject) => {
        if (!files || files.length === 0) {
            console.error('ファイルを選択して下さい')
            reject('Error: choose JSON files')
        }
        const file = files[0]

        const reader = new FileReader()

        // 読み込み終了後に実行される処理
        reader.onload = event => {
            const content = event.target?.result
            try {
                const jsonData = JSON.parse(content as string) as Track[]
                resolve(jsonData)
            } catch (error) {
                console.error('SMMLファイルを解析できませんでした。', error)
                reject()
            }
        }
        
        // 読み込み実行処理
        reader.readAsText(file)
            
    })
}
