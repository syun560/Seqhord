import React, { memo } from "react"
import { Button } from "@fluentui/react-components"
import { Mark, Sequencer } from "@/types"

type MarkBarPropsType = {
    marks: Mark[]
    seq: Sequencer
}

export const MarkBar = memo(function MarkBar({ marks, seq }: MarkBarPropsType) {


    return <div>
        <Button key="defalut" appearance="subtle" onClick={()=>seq.setNowTick(8)}>Start</Button>
        {marks.map(mark=><Button key={mark.tick + mark.name} appearance="subtle" onClick={()=>seq.setNowTick(mark.tick)}>{mark.name}</Button>)}
    </div>
})