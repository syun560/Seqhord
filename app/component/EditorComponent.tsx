"use client"

import React, { useEffect, useRef } from "react"
import { useMonaco } from '@monaco-editor/react'
import localFont from 'next/font/local'

export type CustomLanguageRule = {
    // トークンの名前を表します。
    token: string,

    // トークンのパターンを表します。文字列または正規表現オブジェクトを指定できます。
    tokenPattern: string | RegExp,

    //前景色を表します。
    foreground?: string,

    // 背景色を表します。
    background?: string,
    
    // フォントスタイルを表します。
    fontStyle?: string
}

type EditorComponentPropsType = {
    rules: CustomLanguageRule[],
    value?: string,
    width?: string,
    height?: string
}

const MyricaM = localFont({
    src: './fonts/MyricaM/MyricaM M.ttf',
    variable: "--MyricaM-M"
})


/**
 * エディターを表示するコンポーネント。このコンポーネントを使用するコンポーネントは"use client"モードにして使用してください。
 *
 * @param rules - ハイライトを行う文字列のルール
 * @param [value] - エディターに表示する値
 * @param [height] - エディターの高さ
 * @param [width] - エディターの幅
 */
export const EditorComponent = ({ rules, value, height, width }: EditorComponentPropsType) => {

    const tokens: [string | RegExp, string][] = rules.map(rule => [rule.tokenPattern, rule.token]);
    const styles = rules.map(
        rule => {
            return { token: rule.token, foreground: rule.foreground, background: rule.background, fontStyle: rule.fontStyle };
        }
    )

    const monacoEl = useRef<HTMLDivElement>(null!);
    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            // Register a new language
            monaco.languages.register({ id: "mySpecialLanguage" });
            
            // Register a tokens provider for the language
            monaco.languages.setMonarchTokensProvider("mySpecialLanguage", {
                tokenizer: {
                    root: tokens,
                },
            });
            
            // Define a new theme that contains only rules that match this language
            monaco.editor.defineTheme("myCoolTheme", {
                base: "vs",
                inherit: false,
                rules: styles,
                colors: {
                    "editor.foreground": "#000000",
                },
            });
            
            monaco.editor.create(monacoEl.current!, {
                theme: "myCoolTheme",
                language: "mySpecialLanguage",
                fontSize: 16,
                fontFamily: "var(--MyricaM-M)",
                value: value
            });
        }
    }, [monaco]);

    return (
        <div className={MyricaM.variable} style={{ width: width, height: height }} ref={monacoEl}></div>
    );
}