
import MidiWriter from 'midi-writer-js';
import { Note, Chord } from './types.ts'
import Lib from './Lib.ts'

// MidiWriterJS
export const generate = (notes: Note[], bpm: number) => {
    // 新しいトラックに書き込む
    const track = new MidiWriter.Track();

    // ProgramChangeイベントを書く
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
    track.setTempo(bpm)

    // ノートの追加
    notes.map(n => {
        let note = new MidiWriter.NoteEvent({
            tick: n.tick * 64,
            pitch: Lib.noteNumberToNoteName(n.pitch),
            duration: 'T' + (n.duration * 64),
            channel: 1,
            velocity: 80
        })
        console.log(note)
        track.addEvent(note)
    })


    // const noteEv = new MidiWriter.NoteEvent(
    //     {
    //         pitch: ['C4', 'D4', 'E4'],
    //         duration: '4'
    //     }
    // );
    // track.addEvent(noteEv);

    // data URIを生成する
    const write = new MidiWriter.Writer(track);
    return write.dataUri()

}