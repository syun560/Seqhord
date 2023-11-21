"use client"
import { useState } from "react"
import { Ala } from './alealert.tsx'

const default_text = `
@b=180
@s=F#m
@t=忘れてやらない

@start

a="aa"
oudou=F|G|Em|Am

# A1 ------------
k4	|全部天気の	|せいでいいよ	|この気まずさも	|倦怠感も
c7	|4		|5		|3m		|6m
m5	|_588875	|4 5 3 3	|_588875	|12 3 32 1

k4	|太陽は隠	|れながら		|知らんぷり	|
c7	|4		|5		|6m		|1
m5	|_588875	|4 5 3 3	|_588875	|12 3 32 1

# B1 ------------
k4	|作者の気持ちを	|答えなさい	|一体何が		|正解なんだい
c7	|6		|5		|6m		|1
m5	|_588875	|4 5 3 3	|_588875	|12 3 32 1

# S1 ------------
k4	|青い春		|なんてもんは	|		|正解なんだい
c7	|6		|5		|6m		|1
m5	|1 5 6 3	|4 5 3 3	|_588875	|12 3 32 1
mcd
`

export default function Home() {
    const compile = (text: string) => {
        setText(text)
        
      // 文字列を改行ごとに分割する
      // 文字列を改行ごとに分割して配列に入れる
      
      const lines = text.split('\n')
      
      // 文字列を検索する
      lines.forEach((line, i)=>{
        // 行数制限
        if (i > 500) {
          alert('入力可能な最大行数(500行)を超えています')
          return
        }
        
        // コメント
        if (line.indexOf('@') !== -1){
          if (line.indexOf('b') !== -1){
            const i = line.indexOf('=')
            const b = Number(line.slice(i + 1))
            setBpm(b)
          }
          else if (line[1] === 't'){
            const i = line.indexOf('=')
            const t = line.slice(i + 1)
            setTitle(t)
          }
        }
      })
      
    }
      
      const [text, setText] = useState(default_text)
      const [bpm, setBpm] = useState(120)
      const [title, setTitle] =     useState('none')
      
      return (
        <div className="container">
            <Ala />
          <textarea className="form-control" value={text} rows={20} cols={20} onChange={(e)=>compile(e.target.value)} />
          <div>
            <p>bpm: {bpm}</p>
            <p>title: {title}</p>
            <button type="button" className="btn btn-primary">Primary</button>
          </div>
        </div>
      )
};
