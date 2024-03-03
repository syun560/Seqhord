
import MidiWriter from 'midi-writer-js';
import { Note, Chord } from './types.ts'
import Lib from './Lib.ts'
import { Track } from 'midi-writer-js/build/types/chunks/track';

// MidiWriterJS
export const generate = (notes: Note[][], bpm: number) => {
    
    // トラックを配列で複数作る。
    let tracks: Track[] = []

    // Conductor
    tracks[0] = new MidiWriter.Track();
    tracks[0].addMarker("start")
    tracks[0].addCopyright("Copyright!!")
    tracks[0].addText("text!!")
    tracks[0].setTempo(bpm)
    
    // ノートの追加
    tracks[1] = new MidiWriter.Track();
    tracks[1].addEvent(new MidiWriter.ProgramChangeEvent({instrument: 73, channel: 0}));
    tracks[1].addTrackName("melody")
    tracks[1].addInstrumentName("flute")
    notes[0].map(n => {
        let note = new MidiWriter.NoteEvent({
            tick: n.tick * 64,
            pitch: Lib.noteNumberToNoteName(n.pitch),
            duration: 'T' + (n.duration * 64),
            channel: 0,
            velocity: 80
        })
        //console.log(note)
        tracks[1].addEvent(note)
    })

    // ベーストラックの追加
    tracks[2] = new MidiWriter.Track();
    tracks[2].addEvent(new MidiWriter.ProgramChangeEvent({instrument: 34, channel: 1}))
    tracks[2].addTrackName("bass")
    notes[2].map(n => {
        let note = new MidiWriter.NoteEvent({
            tick: n.tick * 64,
            pitch: Lib.noteNumberToNoteName(n.pitch),
            duration: 'T' + (n.duration * 64),
            channel: 2,
            velocity: 80
        })
        //console.log(note)
        tracks[2].addEvent(note)
    })

    // リズムトラックの追加
    tracks[3] = new MidiWriter.Track();
    tracks[3].addTrackName("rhythm")
    notes[3].map(n => {
        let note = new MidiWriter.NoteEvent({   
            tick: n.tick * 64,
            pitch: Lib.noteNumberToNoteName(n.pitch),
            duration: 'T12',
            channel: 10,
            velocity: 64
        })
        //console.log(note)
        tracks[3].addEvent(note)
    })

    const write = new MidiWriter.Writer(tracks);

    // data URIを生成する
    return write.dataUri()

}