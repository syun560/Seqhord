import React, { memo } from "react"
import { Var2 } from 'types'

type VariablesPropsType = {
    vars: Var2[]
}

export const Variables = memo(function variables ({vars}:VariablesPropsType) {

    return <table className="table">
        
            <thead>
                <tr>
                    <th>name</th>
                    <th>state</th>
                    <th>type</th>
                    <th>len</th>
                </tr>
            </thead>
                
            <tbody>
                {vars.map(v=><tr key={v.name}>
                    <td>{v.name}</td>
                    <td><span className="badge text-bg-secondary">public</span></td>
                    <td>note</td>
                    <td>{v.len}</td>
                </tr>)}
            </tbody>

    </table>
})