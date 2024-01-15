
import MidiWriter from 'midi-writer-js';
import { Note, Chord } from './types.ts'

// MidiWriterJS
export const generate = (notes: Note[]) => {
    // 新しいトラックに書き込む
    const track = new MidiWriter.Track();

    // ProgramChangeイベントを書く
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));

    // ノートの追加
    const noteEv = new MidiWriter.NoteEvent(
        {
            pitch: ['C4', 'D4', 'E4'],
            duration: '4'
        }
    );
    track.addEvent(noteEv);

    // data URIを生成する
    const write = new MidiWriter.Writer(track);
    return write.dataUri()

}