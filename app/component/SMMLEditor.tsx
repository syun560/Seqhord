"use client"
import React ,{ memo } from "react"
import { Editor } from "@monaco-editor/react"

type EditorComponentPropsType = {
    value: string,
    doChange: (text: string) => void,
}

const bef = (monaco: any) => {
    // Register a new language
    monaco.languages.register({ id: "SMML" })

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider("SMML", {
        tokenizer: {
            root: [
                [/^[1-9].+/,"tracks"],
                [/[0-9]+/, "number"],
                [/@[a-z]+/, "program"],
                [/^n.+/,"notes"],
                [/^k.+/,"lyrics"],
                [/^c.+/,"chords"],
            ]
        },
    });

    monaco.editor.defineTheme("darkTheme", {
        base: "vs-dark",
        inherit: false,
        rules: [
            { background: "212529" }, // probably decides minimap color...
            { token: "number", foreground: "#b5b56a" },
            { token: "program", foreground: "#ce916a", fontStyle: "bold" },
            { token: "notes", foreground: "#9cdcf1" },
            { token: "lyrics", foreground: "#e38697" },
            { token: "tracks", foreground: "#4ec9b0" },
            { token: "chords", foreground: "#dcdcaa" },
        ],
        colors: {
            "editor.foreground": "#EEEEEE",
            "editor.background": "#212529",
        },
    })

    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider("SMML", {
        triggerCharacters: ['@'],
        provideCompletionItems: (model: any, position: any) => {
            const word = model.getWordUntilPosition(position);
            const range = new monaco.Range(
                position.lineNumber,
                word.startColumn,
                position.lineNumber,
                word.endColumn
            )
            const suggestions = [
                {
                    label: "@bpm",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "bpm",
                    range,
                    documentation: "曲のBPMを指定します"
                },
                {
                    label: "@scale",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "scale",
                    range,
                    documentation: "曲のスケールを指定します(C, C#, D, ...etc)"
                },
                {
                    label: "@trans",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "trans",
                    range,
                    documentation: "トランスポーズを設定します（1～12）"
                },
                {
                    label: "@title",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "title",
                    range,
                    documentation: "曲のタイトルを設定します"
                },
                {
                    label: "@program",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "program",
                    range,
                    documentation: "楽器の種類を設定します（0～128）"
                },
                {
                    label: "@mark",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "mark",
                    range,
                    documentation: "指定の位置にマークを追加します"
                },
                {
                    label: "@reverb",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "reverb",
                    range,
                    documentation: "楽器の種類を設定します（0～128）"
                }
            ]
            return { suggestions }
        },
    })
}

export const SMMLEditor = memo (function smmlEditor({ value, doChange }: EditorComponentPropsType) {

    // console.log("SMML Editor rendered!!")

    const handleEditorChange = (val: any, event: any) => {
        doChange(val)
    }
    
    const options = {
        theme: "darkTheme",
        language: "SMML",
        fontSize: 18,
        fontFamily: "monospace",
        // fontFamily: "var(--MyricaM-M)",
        value: value,
        scrollBeyondLastLine: false,
        quickSuggestions: true,
        suggest: {
            preview: true,
            localityBonus: true
        }
    }

    return <Editor
        // className={MyricaM.variable}
        height="80%"
        theme="darkTheme"
        language="SMML"
        beforeMount={bef}
        onChange={handleEditorChange}
        value={value}
        options={options}
    />
})