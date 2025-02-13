import React, { memo, useState, useEffect } from "react"

import Link from "next/link";

// fluent ui
import {
    Button, Checkbox,
    Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent,
} from "@fluentui/react-components"

export const FirstDialog = memo(function FirstDialog() {
    const [checked ,setChecked] = useState<boolean>(true)
    const [open, setOpen] = useState<boolean>(false)

    const change = (val: boolean) => {
        setChecked(val)
        localStorage.setItem('first', String(val))
    }

    useEffect (()=>{
        let val = localStorage.getItem('first')
        if (val === null) val = "true"
        setChecked(Boolean(val))
        if (!localStorage) {
            console.log("localstorage非対応")
            return
        }
        if (val === "true"){
            setOpen(true)
        }
    },[])

    return <Dialog open={open} onOpenChange={(event, data) => setOpen(data.open)}>
        <DialogTrigger disableButtonEnhancement>
            <div className="p-1 text-info" style={{ cursor: "pointer" }}><h1 className="px-2 fs-4 fw-bolder ">Seqhord</h1></div>
        </DialogTrigger>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>Seqhordへようこそ</DialogTitle>
            </DialogBody>
            <DialogContent>
                <br />
                <p>Seqhord（シーコード）はテキストを解釈し、演奏データを生成する<br />
                    <strong>ミュージックプログラミングシーケンサ</strong>です。
                    (PC、Webブラウザでの利用想定)</p>
                <p>
                    操作方法など簡単な説明については<Link href="/about/index" target="_blank">ドキュメント</Link>をご覧ください。
                </p>
                <p>■ 支援者一覧（敬称略）<br />
                <strong>NBCG/檀エディ, あたなよく</strong></p>
                <Checkbox checked={checked} onChange={(ev, data) => change(Boolean(data.checked))} label="読込時に表示"/>
            </DialogContent>
            <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                    <Button appearance="primary">OK</Button>
                </DialogTrigger>
            </DialogActions>
        </DialogSurface>
    </Dialog>
})