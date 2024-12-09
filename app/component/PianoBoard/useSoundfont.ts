// See https://github.com/danigb/soundfont-player

import Soundfont, { InstrumentName } from 'soundfont-player';
import { useState } from 'react';

type Props = {
    instrumentName: string
    hostname: string
    format: 'mp3' | 'ogg'
    soundfont: 'MusyngKite' | 'FluidR3_GM'
    audioContext: AudioContext
}

export const useSoundFont = ({instrumentName, hostname, format, soundfont ,audioContext}: Props) => {
    const defaultProps = {
        format: 'mp3',
        soundfont: 'MusyngKite',
        instrumentName: 'acoustic_grand_piano',
    };

    const [activeAudioNodes, setActiveAudioNodes] = useState({})
    const [instrument ,setInstrument] = useState(null)

    // componentDidMount() {
    //     this.loadInstrument(this.props.instrumentName);
    // }

    // componentDidUpdate(prevProps:any, prevState:any) {
    //     if (prevProps.instrumentName !== this.props.instrumentName) {
    //         this.loadInstrument(this.props.instrumentName);
    //     }
    // }

    const loadInstrument = (instrumentName: InstrumentName) => {
        // Re-trigger loading state
        setInstrument(null)
        Soundfont.instrument(audioContext, instrumentName, {
            format,
            soundfont,
            nameToUrl: (name:string, soundfont:string, format:string) => {
                return `${hostname}/${soundfont}/${name}-${format}.js`
            },
        }).then((inst:any) => {
            setInstrument(inst)
        })
    }

    const playNote = (midiNumber:number) => {
        audioContext.resume().then(() => {
            const audioNode = instrument.play(midiNumber)
            this.setState({
                activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
                    [midiNumber]: audioNode,
                }),
            });
        });
    };

    const stopNote = (midiNumber: number) => {
        audioContext.resume().then(() => {
            if (!activeAudioNodes[midiNumber]) {
                return;
            }
            const audioNode = activeAudioNodes[midiNumber];
            audioNode.stop();
            this.setState({
                activeAudioNodes: Object.assign({}, activeAudioNodes, {
                    [midiNumber]: null,
                })
            })
        })
    }

    // Clear any residual notes that don't get called with stopNote
    const stopAllNotes = () => {
        audioContext.resume().then(() => {
            const aan = Object.values(activeAudioNodes);
            aan.forEach(node => {
                if (node) {
                    // node.stop()
                }
            });
            setActiveAudioNodes({})
        })
    }

    return {
        isLoading: instrument,
        playNote,
        stopNote,
        stopAllNotes
    }

}
