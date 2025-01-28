"use client"

import React, { memo, useEffect, useState } from "react"
import { Track } from "@/types";
import { createClient } from "@/utils/supabase/client"
import { insertData } from "@/utils/insertData";
import {
    Button
} from "@fluentui/react-components"

type Song = {
    id: number
    ver: string
    title: string
    author: string
    date: string
    track_num: number
    texts: string
}

type SongsPropsType = {
    tracks: Track[]
    title: string
}

// 時刻を人間に見やすい形式に変換する（タイムゾーン: 日本）
const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
});

export const Songs = memo(function variables ({title, tracks}:SongsPropsType) {
    const [songs, setSongs] = useState<Song[]>([])

    const supabase = createClient()

    useEffect(()=>{
        (async() => {
            const { data: data , error } = await supabase.from("Songs").select('id,created_at,author,title')
            if (error) {
                console.error("data fetch error")
                console.log(error)
            }
            else {
                setSongs(data.map(d=>{
                    return {
                        id: d.id,
                        ver: "1.0",
                        title: d.title,
                        date: formatter.format(new Date(d.created_at)),
                        author: d.author,
                        track_num: 3,
                        texts: "テスト"
                    }
                }))
            }
        })()
    }, [])
    

    return <div>
        <Button onClick={()=>insertData(title, tracks)}>Upload</Button>
        

        <table className="table">
            <thead>
                <tr>
                    <th>song_id</th>
                    <th>state</th>
                    <th>title</th>
                    <th>author</th>
                    <th>date</th>
                </tr>
            </thead>
                
            <tbody>
                {songs.map(song=><tr key={song.id}>
                    <td>{song.id}</td>
                    <td><span className="badge text-bg-secondary">public</span></td>
                    <td>{song.title}</td>
                    <td>{song.author}</td>
                    <td>{song.date}</td>
                </tr>)}
            </tbody>
        </table>
    </div>
})