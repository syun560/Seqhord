import { useState } from 'react'
import { text } from 'stream/consumers'

export const useConsole = () => {

    const [log, setLog] = useState('SMML Pad Ver0.1 ready...\n')
    
    const addLog = (txt: string) => {
        let t = log
        if(!t.endsWith('\n') && !t.endsWith('\r')){
            t += '\n'
        }
        setLog(t + txt)
    }
    const clearLog = () => {
        setLog("")
    }

    return { 
        log, addLog,clearLog
    }
}