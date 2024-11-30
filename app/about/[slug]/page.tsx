"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import slugify from 'slugify'

import './manual.css'

import { makeStyles } from "@fluentui/react-components";

// custom component
const H2 = ({ node, children, ...props }: any) => {
    const id = slugify(children.toString(), { lower: true });
    return <h2 id={id}>{children}</h2>;
};
const H3 = ({ node, children, ...props }: any) => {
    const id = slugify(children.toString(), { lower: true });
    return <h3 id={id}>{children}</h3>;
};
const CustomTable = ({ node, children, ...props }: any) => {
    return <table className='table'>{children}</table>;
}
const A = ({ node, children, ...props }: any) => {
    return <a href={props.href} target="_blank">{children}</a>;
}

const useStyles = makeStyles({
    root: {
        overflow: "hidden",
        display: "flex",
    },
    content: {
        flex: "1",
        padding: "0 10vw",
        height: "100vh",
        overflowY: "scroll",
    },
})

const pageList = [
    { title: "Cord Seekについて", url: "./index" },
    { title: "ユーザマニュアル",
        sub: [
            { title: "音を入力する", url: "./input_notes" },
            { title: "歌詞を入力する", url: "./input_lyrics" },
            { title: "演奏パターンを入力する", url: "./input_patterns" },
            { title: "VOICEVOXとの連携を行う", url: "./voicevox" },
            { title: "予約済キーワード一覧", url: "./reserved" },
        ]
    },
    { title: "開発メモ", url: "./develop",
        sub: [
            { title: "コンパイル", url: "./compile" },
            { title: "UIについて", url: "./ui" },
            { title: "シーケンス関連", url: "./sequence" },
            { title: "エディタ", url: "./editor" },
            { title: "サウンド関連", url: "./sound" },
        ]
    },
    { title: "ご支援について", url: "./donation" },
    { title: "利用規約・クレジット", url: "./credit" },
    { title: "更新履歴", url: "./update" },
]
const pages = pageList.map(page=>(
    <li key={page.title} style={{listStyle: "none"}}>
        {page.url ?
            <Link href={page.url}>{page.title}</Link>    
            :<>{page.title}</>
        }
        <ul>
        {page.sub && page.sub.map(ps=>(
            <li key={page.title + ps.title} style={{listStyle: "none"}}>
                <Link href={ps.url}>{ps.title}</Link>
            </li>
        ))}
        </ul>
    </li>
    ))

export default function Main({params}:{params: { slug: string }}) {
    const styles = useStyles()
    const [markdown, setMarkdown] = useState("")

    const slug = params.slug

    const loadArticle = async () => {
        const a = await fetch(`/articles/${slug}.md`)
        const b = await a.text()
        setMarkdown(b)
    }

    useEffect(()=>{loadArticle()}, [])

    return <div>
        <div className={styles.root}>
            <div>
                <span className="fs-2 p-3">CodeSeeker Docs</span>
                <ul className='mt-2'>
                    {pages}
                </ul>
            </div>

            <div className={styles.content}>
                <ReactMarkdown
                    components={{
                        h2: H2,
                        h3: H3,
                        table: CustomTable,
                        a: A
                    }}
                    remarkPlugins={[remarkBreaks]}
                    rehypePlugins={[remarkGfm, rehypeRaw]}
                    skipHtml={true}
                    disallowedElements={['script']}
                    >
                    {markdown}
                </ReactMarkdown>
            </div>
        </div>
    </div>
}

