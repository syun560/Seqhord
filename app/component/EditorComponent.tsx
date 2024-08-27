"use client"

import React from "react"
import { Editor } from "@monaco-editor/react"
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

    const handleEditorChange = (val: any, event: any) => {
        doChange(val)
    }

    const bef = (monaco: any) => {
        console.log('bef')
        console.log(monaco)
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
            base: "vs-dark",
            inherit: true,
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
            provideCompletionItems: (model: any, position: any) => {
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
    }

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
        language="mySpecialLanguage"
        beforeMount={bef}
        onChange={handleEditorChange}
        value={value}
        options={options}
    />
}