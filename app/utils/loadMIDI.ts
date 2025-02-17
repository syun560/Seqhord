import { Track } from 'types'
// https://github.com/Tonejs/Midi
import { Midi } from '@tonejs/midi'

type NoteDatum = {
    channel: number
    note: number // MIDIのノート（60 = ドの音）
    time: number // 小節（0小節から始まる、2で1小節）
    duration: number // 長さ（2で全音符, 0.5: 4分音符, 0.25: 8分音符）
}

export const loadMIDI = async (files: any, setTracks: (tracks: Track[])=>void ,setBPM: (bpm: number)=> void) => {
    if (!files || files.length === 0) {
        console.error('ファイルを選択して下さい')
        return
    }
    const file = files[0]
    const midiURL = URL.createObjectURL(file)
    
    const tmpNotes:NoteDatum[] = []

    const midi = await Midi.fromUrl(midiURL)
    console.log('midi load start')

    // 拍子を設定
    // midi.header.timeSignatures

    console.log('Tracks:')
    console.log(midi.tracks)

    midi.tracks.forEach((track, index) => {
        const notes = track.notes
        notes.forEach((note, i) => {
            tmpNotes.push({
                channel: index,
                note: note.midi,
                time: note.ticks,
                duration: note.durationTicks
            })
        })
    })

    // ロード完了
    console.log(midi.header)
    console.log(tmpNotes)
    console.log('midi load end')

    // const reader = new FileReader()
    // reader.onload = event => {
    //     const content = event.target?.result
    //     try {
    //         const jsonData = JSON.parse(content as string) as Track[]
    //         setTracks(jsonData)
    //         const res = compile(jsonData)
    //         setBPM(res.bpm)
    //     } catch (error) {
    //         console.error('SMMLファイルを解析できませんでした。', error)
    //     }
    // }
    
    // reader.readAsText(file)
}
