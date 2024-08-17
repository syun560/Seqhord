"use client"

import React, { useRef, useEffect } from "react"
import { Editor, useMonaco } from "@monaco-editor/react"
// import { useMonaco } from '@monaco-editor/react'
import localFont from 'next/font/local'

export type CustomLanguageRule = {
    // トークンの名前を表します。
    token: string,
    // トークンのパターンを表します。文字列または正規表現オブジェクトを指定できます。
    tokenPattern: string | RegExp,

    foreground?: string,
    background?: string,
    fontStyle?: string
}

type EditorComponentPropsType = {
    value?: string,
    doChange?: string,
}

const MyricaM = localFont({
    src: './fonts/MyricaM/MyricaM M.ttf',
    variable: "--MyricaM-M"
})


/**
 * エディターを表示するコンポーネント。このコンポーネントを使用するコンポーネントは"use client"モードにして使用してください。
 *
 * @param [value] - エディターに表示する値
 */
export const EditorComponent = ({ value, doChange }: EditorComponentPropsType) => {

    // const monacoRef = useRef(null);
    // const editorRef = useRef<HTMLDivElement>(null!);

    const monaco = useMonaco()

    const handleEditorChange = (val: any, event: any) => {
        console.log('current value:', val)
    }

    // const tokens: [string | RegExp, string][] = rules.map(rule => [rule.tokenPattern, rule.token]);
    // const styles = rules.map(
    //     rule => {
    //         return { token: rule.token, foreground: rule.foreground, background: rule.background, fontStyle: rule.fontStyle };
    //     }
    // )

    const handleEditorDidMount = (ed: HTMLDivElement, monaco: any) => {

        // Register a new language
        monaco.languages.register({ id: "mySpecialLanguage" });

        // Register a tokens provider for the language
        // monaco.languages.setMonarchTokensProvider("mySpecialLanguage", {
        //     tokenizer: {
        //         root: tokens,
        //     },
        // });

        // Define a new theme that contains only rules that match this language
        monaco.editor.defineTheme("myCoolTheme", {
            base: "vs",
            inherit: false,
            rules: [
                { token: "custom-info", foreground: "808080" },
                { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
                { token: "custom-notice", foreground: "FFA500" },
                { token: "custom-date", foreground: "008800" },
            ],
            colors: {
                "editor.foreground": "#000000",
            },
        });
        console.log("onMount: the monaco instance:", monaco)
        console.log("onMount: the editor instance:", ed)
    }

    useEffect(()=>{
        if (monaco) {
            monaco.languages.register({ id: "mySpecialLanguage" })
            monaco.editor.defineTheme("myCoolTheme", {
                base: "vs",
                inherit: false,
                rules: [],
                colors: {
                    "editor.foreground": "#EEEEEE",
                    "editor.background": "#111111"
                },
            });
            monaco.editor.setTheme("myCoolTheme")
        }
    },[monaco])

    // const monaco = useMonaco();

    // useEffect(() => {
    //     if (monaco) {
    //         // Register a new language
    //         monaco.languages.register({ id: "mySpecialLanguage" });

    //         // Register a tokens provider for the language
    //         monaco.languages.setMonarchTokensProvider("mySpecialLanguage", {
    //             tokenizer: {
    //                 root: tokens,
    //             },
    //         });

    //         // Define a new theme that contains only rules that match this language
    //         monaco.editor.defineTheme("myCoolTheme", {
    //             base: "vs",
    //             inherit: false,
    //             rules: styles,
    //             colors: {
    //                 "editor.foreground": "#EEEEEE",
    //                 "editor.background": "#111111"
    //             },
    //         });

    //         monaco.editor.create(monacoEl.current!, {
    //             theme: "myCoolTheme",
    //             language: "mySpecialLanguage",
    //             fontSize: 16,
    //             fontFamily: "var(--MyricaM-M)",
    //             value: value
    //         });
    //     }
    // }, [monaco]);

    return (
        // <div className={MyricaM.variable} style={{ width: width, height: height }} ref={monacoEl}></div>
        <Editor
            height="80vh"
            theme="vs-dark"
            // onChange={handleEditorChange}
            // onMount={handleEditorDidMount}
        />
    );
}