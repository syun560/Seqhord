"use client"
import React ,{ memo } from "react"
import { Editor } from "@monaco-editor/react"
import localFont from 'next/font/local'

type EditorComponentPropsType = {
    value: string,
    doChange: (text: string) => void,
}

const MyricaM = localFont({
    src: './fonts/MyricaM/MyricaM M.ttf',
    variable: "--MyricaM-M"
})

const bef = (monaco: any) => {
    // Register a new language
    monaco.languages.register({ id: "SMML" })

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider("SMML", {
        tokenizer: {
            root: [
                // [/\[error.*/, "custom-error"],
                // [/\[notice.*/, "custom-notice"],
                // [/\[info.*/, "custom-info"],
                // [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
                [/^[1-9].+/,"tracks"],
                [/[0-9]+/, "number"],
                [/@[a-z]+/, "program"],
                [/^n.+/,"notes"],
                [/^k.+/,"lyrics"],
                [/^c.+/,"chords"],
            ]
        },
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme("darkTheme", {
        base: "vs-dark",
        inherit: false,
        rules: [
            { background: "212529" }, // probably decides minimap color...
            // { token: "custom-info", foreground: "808080" },
            // { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
            // { token: "custom-notice", foreground: "FFA500" },
            // { token: "custom-date", foreground: "008800" },
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
        provideCompletionItems: (model: any, position: any) => {
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };
            const suggestions = [
                {
                    label: "bpm",
                    kind: monaco.languages.CompletionItemKind.Text,
                    insertText: "bpm",
                    range: range,
                },
                {
                    label: "scale",
                    kind: monaco.languages.CompletionItemKind.Text,
                    insertText: "scale",
                    range: range,
                },
                {
                    label: "trans",
                    kind: monaco.languages.CompletionItemKind.Text,
                    insertText: "trans",
                    range: range,
                },
                {
                    label: "title",
                    kind: monaco.languages.CompletionItemKind.Text,
                    insertText: "title",
                    range: range,
                },
                {
                    label: "program",
                    kind: monaco.languages.CompletionItemKind.Text,
                    insertText: "program",
                    range: range,
                },
                // {
                //     label: "@simpleText",
                //     kind: monaco.languages.CompletionItemKind.Text,
                //     insertText: "simpleText",
                //     range: range,
                // },
                // {
                //     label: "testing",
                //     kind: monaco.languages.CompletionItemKind.Keyword,
                //     insertText: "testing(${1:condition})",
                //     insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                //     range: range,
                // },
                // {
                //     label: "setProgram",
                //     kind: monaco.languages.CompletionItemKind.Keyword,
                //     insertText: "program = ",
                //     insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                //     range: range,
                // },
                // {
                //     label: "ifelse",
                //     kind: monaco.languages.CompletionItemKind.Snippet,
                //     insertText: [
                //         "if (${1:condition}) {",
                //         "\t$0",
                //         "} else {",
                //         "\t",
                //         "}",
                //     ].join("\n"),
                //     insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                //     documentation: "If-Else Statement",
                //     range: range,
                // },
            ]
            return { suggestions: suggestions }
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
        scrollBeyondLastLine: false
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