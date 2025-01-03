import React, { memo, useState, useEffect } from "react"
import type { CheckboxProps } from "@fluentui/react-components";

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
            <div className="fs-4 fw-bolder p-2 text-info" style={{ cursor: "pointer" }}>Seqhord</div>
        </DialogTrigger>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>Sechordへようこそ</DialogTitle>
            </DialogBody>
            <DialogContent>
                <br />
                <p>Seqhord（シーコード）はテキストを解釈し、演奏データを生成する<br />
                    <strong>サウンドプログラミングミュージックシーケンサ</strong>です。<br />
                    操作方法など簡単な説明については<Link href="https://youtu.be/Uhj9IiNYFsk?si=4QzzXbfAaDRHrqse">紹介動画</Link>をご覧ください。</p>
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