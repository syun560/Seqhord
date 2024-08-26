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
    value: string,
    doChange: (text: string) => void,
}

const MyricaM = localFont({
    src: './fonts/MyricaM/MyricaM M.ttf',
    variable: "--MyricaM-M"
})

export const EditorComponent = ({ value, doChange }: EditorComponentPropsType) => {

    const monaco = useMonaco()

    const handleEditorChange = (val: any, event: any) => {
        // console.log('current value:', val)
        doChange(val)
    }

    // const tokens: [string | RegExp, string][] = rules.map(rule => [rule.tokenPattern, rule.token]);
    // const styles = rules.map(
    //     rule => {
    //         return { token: rule.token, foreground: rule.foreground, background: rule.background, fontStyle: rule.fontStyle };
    //     }
    // ) 

    useEffect(() => {
        console.log('useEffect')
        console.log('monaco: ', monaco)
        alert('うんち1')

        if (monaco) {
            console.log('useEffect(Monaco true)')

            // Register a new language
            monaco.languages.register({ id: "mySpecialLanguage" })

            // Register a tokens provider for the language
            monaco.languages.setMonarchTokensProvider("mySpecialLanguage", {
                tokenizer: {
                    root: [
                        [/\[error.*/, "custom-error"],
                        [/\[notice.*/, "custom-notice"],
                        [/\[info.*/, "custom-info"],
                        [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
                    ]
                },
            });

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
                    "editor.foreground": "#119911",
                },
            })

            // Register a completion item provider for the new language
            monaco.languages.registerCompletionItemProvider("mySpecialLanguage", {
                provideCompletionItems: (model:any, position:any) => {
                    var word = model.getWordUntilPosition(position);
                    var range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn,
                    };
                    var suggestions = [
                        {
                            label: "simpleText",
                            kind: monaco.languages.CompletionItemKind.Text,
                            insertText: "simpleText",
                            range: range,
                        },
                        {
                            label: "testing",
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: "testing(${1:condition})",
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            range: range,
                        },
                        {
                            label: "ifelse",
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: [
                                "if (${1:condition}) {",
                                "\t$0",
                                "} else {",
                                "\t",
                                "}",
                            ].join("\n"),
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: "If-Else Statement",
                            range: range,
                        },
                    ]
                    return { suggestions: suggestions }
                },
            })
            alert('うんち2')
            console.log(monaco.editor.getModels())
        }
    }, [monaco])

    const options = {
        theme: "myCoolTheme",
        language: "mySpecialLanguage",
        fontSize: 18,
        fontFamily: "monospace",
        value: value
    }

    return <Editor
        height="100%"
        theme="myCoolTheme"
        onChange={handleEditorChange}
        value={value}
        options={options}
    />
}