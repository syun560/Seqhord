import { useState } from 'react'

export const useConsole = () => {

    const [log, setLog] = useState('SMML Pad Ver0.1 ready...\n')
    
    const addLog = (txt: string) => {
        setLog(s => s + txt)
    }
    const clearLog = () => {
        setLog("")
    }

    return { 
        log, addLog,clearLog
    }
}