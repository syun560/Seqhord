import React, { memo, useEffect } from 'react'
import { Track, VoiceVox, WebAudio } from 'types'
import { RotaryKnob } from "./RotaryKnob";

interface SingerProps {
    vox: VoiceVox
    tracks: Track[]
    bpm: number
    audio: WebAudio
}

export const Singer = memo(function Singer({ vox, tracks, bpm, audio }: SingerProps) {

    const VoiceVolumeChange = (val: number):void => {
        audio.changeVolume(val/100)
    }

    const VoiceSynth = async () => {
        try {
            await vox.synthVoice(tracks[0].notes, bpm)
        }
        catch (err) {
            console.error("VoiceSynth Error:", err)
        }
    }

    // セレクトタグの内容を作る
    let items = [<option key="no" value={0}>VOICEVOX未接続</option>]
    const singers = vox.singers_info
    if (singers.length > 0) {
        items = singers.map(singer =>
            <option key={singer.speaker_uuid} value={singer.styles[0].id}>
            {singer.name}
        </option>
    )
}

    const onChangeSinger = async (id: number) => {
        console.log("set singer: ", id)
        vox.setSinger(id)

        const found = vox.singers_info.find(singer => singer.styles[0].id === id)
        const speaker_uuid = found?.speaker_uuid
        console.log("speaker_uuid:", speaker_uuid)

        try {
            const url = `http://localhost:50021/singer_info?speaker_uuid=${speaker_uuid}&resource_format=url`
            const res = await fetch(url)
            const json = await res.json()
            vox.setSingersPortrait(json.portrait)
            console.log(json)
        }
        catch (err) {
            console.error(err)
        }

        // 音声合成も行う
        VoiceSynth()
    }

    useEffect(() => {
        if (vox.audioData) audio.setURL(URL.createObjectURL(vox.audioData))
    }, [vox.audioData])

    return <div className='d-flex'>
        <div className='mx-2'>
            <select className="form-select" onChange={(e) => onChangeSinger(Number(e.target.value))} value={vox.singer}>
                {items}
            </select>
        </div>
        <RotaryKnob value={audio.volume} onChange={VoiceVolumeChange} min={0} max={100}  />
    </div>
    
})