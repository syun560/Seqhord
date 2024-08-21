"use client"

import React, { useEffect } from "react"
import { Editor, useMonaco } from "@monaco-editor/react"
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

export const EditorComponent = ({ value, doChange }: EditorComponentPropsType) => {

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

    useEffect(()=>{
        console.log('useEffect')
        console.log(monaco)

        if (monaco) {
            console.log('useEffect(Monaco true)')
            monaco.languages.register({ id: "mySpecialLanguage" })
            // monaco.editor.defineTheme("myCoolTheme", {
            //     base: "vs",
            //     inherit: true,
            //     rules: [],
            //     colors: {
            //         "editor.foreground": "#EEEEEE",
            //         "editor.background": "#111111"
            //     },
            // });
        }
    },[monaco])

    const options = {
        // theme: "myCoolTheme",
        language: "mySpecialLanguage",
        fontSize: 18,
        // fontFamily: "monospace",
        value: value
    }

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



    return <Editor
            // height="80vh"
            height="100%"
            theme="vs-dark"
            onChange={handleEditorChange}
            value={value}
            options={options}
    />
}