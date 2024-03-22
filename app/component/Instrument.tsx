import React, { useState, useEffect} from 'react'

export type SeqState = {
    // シーケンス
    isPlaying: boolean
    nowTick: number
    bpm: number
    
    // MIDI
    output: any
}

export const initialSeqState: SeqState = {
    isPlaying: false,
    nowTick: 0,
    bpm: 120,
    output: null,
}

export type SeqAction = 
    {type: 'setIsPlaying'; isPlaying: boolean}|
    {type: 'setNowTick'; nowTick: number}|
    {type: 'setBPM'; bpm: number}|
    {type: 'nextTick'}|
    {type: 'stop'}|
    {type: 'REGISTER_OUTPUT'; output: any}|
    {type: 'NOTE_ON'; note: number; channel: number}|
    {type: 'ALL_NOTE_OFF'}|
    {type: 'PROGRAM_SET_ALL'}|
    {type: 'PROGRAM_CHANGE'; programNumber: number; channel: number}

// stateとactionを受け取り、actionのtypeによってstateの更新方法を変える
export const seqReducer = (state: SeqState, action: SeqAction): SeqState => {
    switch (action.type) {
    case 'setIsPlaying': return { ...state, isPlaying: action.isPlaying }
    case 'setNowTick': return { ...state, nowTick: action.nowTick }
    case 'setBPM': return { ...state, bpm: action.bpm}
    case 'nextTick': return { ...state, nowTick: state.nowTick + 1}
    case 'stop':
        return {
            ...state,
            nowTick: 0,
            isPlaying: false
        }
 
    // MIDIデバイス操作-------------------------------------
    case 'REGISTER_OUTPUT':
        return {
            ...state,
            output: action.output,
        }
    case 'NOTE_ON':
        {
            const ch = action.channel
            // state.output.send([0x90 + ch, action.note, 40])
            // state.output.send([0x80 + ch, action.note, 40], window.performance.now() + 1000) // 1秒後にノートオフ
            break
        }
    case 'ALL_NOTE_OFF':
        // state.output.send([0xB0, 0x7B, 0])
        break
    case 'PROGRAM_SET_ALL':
        // state.channelData.map((ch, index) => state.output.send([0xC0 + index, ch.program]))
        break
    case 'PROGRAM_CHANGE':
        const ch = action.channel
        const num = action.programNumber
        // state.output.send([0xC0 + ch, num])
        // let newChannelData = state.channelData.slice()
        // newChannelData[ch].program = num
        break
        // return {
        //     ...state,
        //     channelData: newChannelData
        // }
    default:
        return state
    }
    return state
}

export const Instrument = () => {
    const [selectedOutPortID, setSelectedOutPortID] = useState('')
    const [selectedInPortID, setSelectedInPortID] = useState('')
    const [inPorts, setInPorts]: [any, any] = useState([])
    const [outPorts, setOutPorts]: [any, any] = useState([])
    const [outputs, setOutputs] = useState<any>()


    // テストで音を鳴らす
    const doClick= () => {
         // 出力先の MIDI ポートを取得
         const output = outputs.get(selectedOutPortID);

         // MIDI メッセージを送信
         output.send([0x90, 60, 100]);                                       // ノートオン
         output.send([0x80, 60, 100], window.performance.now() + 500);      // 1秒後にノートオフ
         // MIDI メッセージを送信
         output.send([0x90, 64, 100]);                                       // ノートオン
         output.send([0x80, 64, 100], window.performance.now() + 500);      // 1秒後にノートオフ
         // MIDI メッセージを送信
         output.send([0x90, 67, 100]);                                       // ノートオン
         output.send([0x80, 67, 100], window.performance.now() + 500);      // 1秒後にノートオフ

         // outputを登録する
         //seqDispatch({type: 'REGISTER_OUTPUT', output: output})
    }

    // 読み込み時に実行
    useEffect(()=>{
        navigator.requestMIDIAccess({sysex: true}).then(
            // 成功時
            (midiAccess) => {                
                // InPortの取得、設定
                let inputIterator = midiAccess.inputs.values();
                let inPorts:any = []
                for (let input = inputIterator.next(); !input.done; input = inputIterator.next()) {
                    let value = input.value;
                    inPorts.push({
                        name: value.name,
                        ID: value.id
                    })
                    // イベント登録
                    //value.addEventListener('midimessage', this.inputEvent, false);
                }
                if (inPorts.length) setSelectedInPortID(inPorts[0].ID)
                setInPorts(inPorts)

                // OutPortの取得、設定
                let outPorts:any = []
                const tmpOutputs:any = midiAccess.outputs
                setOutputs(midiAccess.outputs)
                for (let output of tmpOutputs.values()) {
                    outPorts.push({
                        device: output,
                        name: output.name,
                        ID: output.id
                    })
                }
                if (outPorts.length) {
                    setSelectedOutPortID(outPorts[0].ID)

                    // outputを登録する
                    //seqDispatch({type: 'REGISTER_OUTPUT', output: tmpOutputs.get(outPorts[0].ID)})
                }
                setOutPorts(outPorts)
                console.log("MIDI READY!!!");

                // チャンネルを初期化する（Programのセットを行う）
                //seqDispatch({ type: 'PROGRAM_CHANGE', channel: 1, programNumber: 25 })
            },
 
            // 失敗時
            (msg) => console.log("MIDI FAILED - " + msg)
        )
    }, [])

    // セレクトタグの内容を作る
    let n = 0
    // let in_items = inPorts.map((value:any) =>
    //     <option key={n++} value={value.ID}>{value.name} ({value.ID})</option> 
    // )
    let out_items = outPorts.map((value:any) =>
        <option key={n++} value={value.ID}>{value.name} ({value.ID})</option> 
    )

    return <span className='me-2'>
        {/* <tr><td>Input: </td><td><select>{ in_items }</select></td></tr> */}
        
        MidiOut: <select onChange={(e)=>setSelectedOutPortID(e.target.value)}
        defaultValue="-1">
            { out_items }
        </select>
        <button onClick={doClick}>テスト</button>
    </span>
}