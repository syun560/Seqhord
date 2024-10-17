export const loadJSON = (files: any, setTracks: any) => {
    if (!files || files.length === 0) {
        console.error('ファイルを選択して下さい')
        return
    }

    const file = files[0]

    const reader = new FileReader()
    reader.onload = event => {
        const content = event.target?.result
        try {
            const jsonData = JSON.parse(content as string)
            console.log(jsonData)
            setTracks(jsonData)
        } catch (error) {
            console.error('SMMLファイルを解析できませんでした。', error)
        }
    }
    
    reader.readAsText(file)
}
