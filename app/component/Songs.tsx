"use client"

import React, { memo, useEffect, useState } from "react"
import { Track } from "@/types";
import supabase from "@/utils/supabase";
import { insertData } from "@/utils/insertData";

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

export const Songs = memo(function Songs ({title, tracks}:SongsPropsType) {
    const [songs, setSongs] = useState<Song[]>([])

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
        <button className="btn btn-secondary m-2" onClick={()=>insertData(title, tracks)}>Upload</button>
        

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>State</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
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