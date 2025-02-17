"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import slugify from 'slugify'

import './manual.css'

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

const pageList = [
    { title: "Seqhordについて", url: "./index" },
    {
        title: "ユーザマニュアル",
        sub: [
            { title: "音を入力する", url: "./input_notes" },
            { title: "コード（和音）を付与する", url: "./input_chords" },
            { title: "演奏パターンを定義する", url: "./input_patterns" },
            { title: "プレビュー再生する", url: "./preview" },
            { title: "歌詞を入力する", url: "./input_lyrics" },
            { title: "VOICEVOXで歌声合成を行う", url: "./voicevox" },
            // { title: "予約済キーワード一覧", url: "./reserved" },
        ]
    },
    // { title: "開発メモ", url: "./develop",
    //     sub: [
    //         { title: "コンパイル", url: "./compile" },
    //         { title: "UIについて", url: "./ui" },
    //         { title: "シーケンス関連", url: "./sequence" },
    //         { title: "PianoBoardについて", url: "./piano_board" },
    //         { title: "エディタ", url: "./editor" },
    //         { title: "サウンド関連", url: "./sound" },
    //     ]
    // },
    // { title: "ご支援について", url: "./donation" },
    // { title: "利用規約・クレジット", url: "./credit" },
    // { title: "更新履歴", url: "./update" },
]
const pages = (s :string) => pageList.map(page => (
    <li key={page.title} className='nav-item first'>

        {page.url ?
            <Link href={page.url}>{page.title}</Link>
            : <>{page.title}</>
        }
        <ul>
            {page.sub && page.sub.map(ps => (
                <li key={page.title + ps.title + s} style={{listStyle: "none"}}>
                    <Link href={ps.url}>{ps.title}</Link>
                </li>
            ))}
        </ul>
    </li>
))

export default function Main({ params }: { params: { slug: string } }) {
    const [markdown, setMarkdown] = useState("")
    const [open, setOpen] = useState(false)

    const slug = params.slug

    const loadArticle = async () => {
        const a = await fetch(`/articles/${slug}.md`)
        const b = await a.text()
        setMarkdown(b)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadArticle() }, [])

    return <div>

        <nav className="navbar navbar-expand-md fixed-top border-bottom bg-body-tertiary">
            <div className="container-fluid">
                <h1 className="navbar-brand fs-4 mybrand">Seqhord Docs</h1>

                <button className="navbar-toggler" type="button" onClick={() => setOpen(prev => !prev)}>
                    <span className="navbar-toggler-icon"></span>
                </button>

            </div>
        </nav>

        <div className="container-fluid">
            <div className="d-flex">

                <nav className={`d-md-none collapse-index ${open ? 'open' : 'close'}`}>
                    <ul className='nav flex-column'>
                        {pages("sub")}
                    </ul>
                </nav>

                <nav className="d-none d-md-block myindex">
                    <ul className='nav flex-column'>
                        {pages("main")}
                    </ul>
                </nav>

                <div className="bg-light content">
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
    </div>
}

