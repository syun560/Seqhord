import React from "react"
import { useState } from "react"

type TabSelectorPropsType = {
    children: React.FC[]
}

export const TabSelector : React.FC<TabSelectorPropsType> = ({children}) => {
    const [tabnum, setTabnum] = useState(0)


    const tabChange = (t: number) => {
        if (t !== tabnum) {
            setTabnum(t)
        }
    }

    return <ul className="nav nav-tabs">
    {children.map((Fc, i)=>{
        return <li className="nav-item" key={i}>
            <a className={"pointer nav-link" + (i === tabnum ? " active" : "")} onClick={()=>tabChange(i)}>
                {Fc.name}/{Fc.displayName}
            </a>
        </li>
    })}
    </ul>
}