import xmljs from 'xml-js';
import { Note } from '../types.ts'
import { midiNumberToPitchMusicXML } from './convert.ts';

const getStemType = (duration: number) => {
    let stem = ''
    if (duration >= 1) stem = 'eighth'
    if (duration >= 2) stem = 'quarter'
    if (duration >= 4) stem = 'half'
    if (duration >= 8) stem = 'whole'
    return stem
}

export const generate_musicxml = (trackIndex: number, allNotes: Note[], bpm: number) => {
    const reso = 1 // 8符音符の長さ
    const divisions = reso * 2 // 4部音符の長さ
    const max_mea = allNotes[allNotes.length - 1].tick * 8 + 1

    const m_cnt = 8 // 1小節のカウントの数
    
    let measures = []
    let tick = 0
    let dur_cnt = 0
    let tie_note:any = {} // タイを一次保存しておくノート

    // 全小節イテレートを行う
    for (let mea = 0; mea < max_mea; mea++){
        // 現在の小節のNotesを取得
        let foundNotes = allNotes.filter(an => Math.floor(an.tick / 8) === mea)
        let notes:any = []

        // タイを追加
        if (dur_cnt !== 0){
            notes.push(tie_note)
        }

        // Notesが見つからない場合は全休符
        if (foundNotes === undefined) {
            const cnt = m_cnt - dur_cnt
            notes.push({
                rest: {},
                duration: (m_cnt - dur_cnt) * reso,
                type: 'whole'
            });
            tick += cnt
            dur_cnt = 0
        }

        // 見つかったNotesをイテレートしていく
        else {
            
            foundNotes.forEach(fn => {

                // 現在のtickが見つかったtickと合ってない場合は、休符を追加する
                if (tick < fn.tick) {
                    const rest = fn.tick - tick
                    notes.push({
                        rest: {},
                        duration: reso * rest,
                        type: getStemType(reso*rest)
                    })
                    tick += rest
                    dur_cnt += rest
                }
                notes.push({
                    _attributes: {
                        dynamics: 60,
                    },
                    pitch: midiNumberToPitchMusicXML(fn.pitch),
                    duration: fn.duration * reso,
                    type: getStemType(fn.duration * reso),
                    lyric: {
                        text: fn.lyric !== '' ? fn.lyric : 'ら',
                    }
                })

                tick += fn.duration
                dur_cnt += fn.duration
            })
            // dur_cntがm_cntを超える場合は、次の譜面にタイを追加する
            if (dur_cnt > 8) {
                // 直前のノートのオーバーしたdurationを短くする
                const cnt = dur_cnt - m_cnt
                notes[notes.length - 1].duration -= cnt * reso

                // 始まりのタイを追加
                notes[notes.length - 1] = {
                    ...notes[notes.length - 1],
                    tie: {
                        _attributes: {
                            type: 'start',
                        },
                    }
                }

                // 終わりのタイを追加
                tie_note = {
                    ...notes[notes.length - 1],
                    duration: cnt * reso,
                    tie: {
                        _attributes: {
                            type: 'stop',
                       },
                    },
                    type: getStemType(cnt *reso),
                    lyric: {
                        text: 'ー',
                    }
                }
                dur_cnt = cnt
                //console.log(tie_note)
            }
            // dur_cntがm_cntに足りない場合は、休符を追加する
            else if (dur_cnt < 8) {
                const cnt = m_cnt - dur_cnt
                notes.push({
                    rest: {},
                    duration: reso * cnt
                })
                dur_cnt = 0
                tick += cnt
            }
            else {
                dur_cnt = 0
            }
        }
        measures.push({
            _attributes: {
                number: mea,
            },
            note: notes,
        })
        // 最後に全休符を追加する
        if (mea === max_mea - 1) {
            measures.push({
                _attributes: {
                    number: mea + 1,
                },
                note: {
                    rest: {},
                    duration: m_cnt * reso
                },
            })
        }
    }

    measures.unshift({
        _attributes: {
            number: '1',
        },
        attributes: {
            divisions: divisions,
            key: {
                fifths: 0,
            },
            time: {
                beats: 4,
                'beat-type': 4
            },
            clef: {
                sign: 'G',
                line: 2,
            },
        },
        sound: {
            _attributes: {
                tempo: bpm,
            }
        },
        note: {
            rest: {},
            duration: 8,
            type: 'whole'
        },
    })

    const jsobject = {
        _declaration: {
            _attributes: {
                version: '1.0',
                encoding: 'utf-8'
            }
        },
        _doctype: 'score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"',
        'score-partwise': {
            _attributes: {
                version: '3.1',
            },
            'part-list': {
                'score-part': {
                    _attributes: {
                        id: `p${trackIndex}`,
                    },
                    'part-name': 'partName',
                },
            },
            part: {
                _attributes: {
                    id: `p${trackIndex}`,
                },
                measure: measures,
            },
        },
    };

    console.log(measures);

    const xml = xmljs.js2xml(jsobject, { compact: true, spaces: 2 });
    return xml;
};