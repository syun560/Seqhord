"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
    { title: "ユーザマニュアル", url: "./manual",
        sub: [
            { title: "VOICEVOXとの連携を行う", url: "./voicevox" },
            { title: "予約済キーワード一覧", url: "./reserved" },
        ]
    },
    { title: "開発メモ", url: "./develop",
        sub: [
            { title: "コンパイルについて", url: "./compile" },
            { title: "テンポとSetTimer", url: "./tempo" },
        ]
    },
    { title: "ご支援について", url: "./donation" },
    { title: "クレジット", url: "./credit" },
    { title: "更新履歴", url: "./update" },
]
const pages = pageList.map(page=>(
    <li key={page.title}>
        <Link href={page.url}>{page.title}</Link>
        <ul>
        {page.sub && page.sub.map(ps=>(
            <li key={page.title + ps.title}>
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
        <div className={styles.root} suppressHydrationWarning={true}>
            <ul>
                {pages}
            </ul>

            <div className={styles.content}>
                <ReactMarkdown
                    components={{
                        h2: H2,
                        h3: H3,
                        table: CustomTable,
                        a: A
                    }}
                    rehypePlugins={[remarkGfm]}
                    >
                    {markdown}
                </ReactMarkdown>
            </div>
        </div>
    </div>
}

