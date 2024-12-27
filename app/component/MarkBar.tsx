import React, { memo } from "react"
import { Button } from "@fluentui/react-components"
import { Mark, Sequencer } from "@/types"

type MarkBarPropsType = {
    marks: Mark[]
    seq: Sequencer
}

export const MarkBar = memo(function MarkBar({ marks, seq }: MarkBarPropsType) {

    return <div>
        {marks.map(mark=><Button appearance="subtle" onClick={()=>seq.setNowTick(mark.tick)}>{mark.name}</Button>)}
    </div>
})