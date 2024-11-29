import React, { memo } from "react"
import { Var2 } from 'types'

type VariablesPropsType = {
    vars: Var2[]
}

export const Variables = memo(({vars}:VariablesPropsType) => {

    return <table className="table table-sm">
        
            <thead>
                <tr>
                    <th>name</th>
                    <th>len</th>
                </tr>
            </thead>
                
            <tbody>
                {vars.map(v=><tr key={v.name}>
                    <td>{v.name}</td>
                    <td>{v.len}</td>
                </tr>)}
            </tbody>

    </table>
})