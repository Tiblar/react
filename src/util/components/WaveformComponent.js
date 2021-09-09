import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Slider from "react-input-slider";

import PauseIcon from '../../assets/svg/audio-pause.svg';
import PlayIcon from '../../assets/svg/audio-play.svg';
import BackwardIcon from '../../assets/svg/icons/backward.svg';
import ForwardIcon from '../../assets/svg/icons/forward.svg';

import waveformStyles from '../../css/components/waveform.css';
import formStyles from '../../css/form.css';

import {secondsToTime} from "../date";

class WaveformComponent extends Component {
    state = {
        loading: true,
        playing: false,
        time: null,
        speed: 1,
        volume: 90,
        nonce: [...Array(36)].map(() => Math.random().toString(36)[2]).join('')
    };

    componentDidMount() {
        const track = this.props.options.track;

        this.waveform = WaveSurfer.create({
            container: `#waveform-${this.props.id}-${this.state.nonce}`,
            waveColor: '#c9cad3',
            progressColor: '#7286e9',
            barWidth: 2,
            responsive: true,
            normalize: true,
            barGap: 1,
            cursorWidth: 0,
            backend: 'MediaElement',
            height: 64,
            barRadius: 2,
            hideScrollbar: true,
            zIndex: 1,
        });

        this.waveform.load(track, this.props.options.wave)

        const updateTime = e => {
            let totalTime = this.waveform.getDuration()
            let currentTime = this.waveform.getCurrentTime();
            let remainingTime = secondsToTime(totalTime - currentTime);

            this.setState({ ...this.state, time: remainingTime })
        }

        this.waveform.on("ready", () => {
            this.setState({ ...this.state, loading: false })
        });

        this.waveform.on("ready", updateTime);
        this.waveform.on("audioprocess", updateTime);

        this.waveform.on("finish", () => {
            this.waveform.seekTo(0);
            this.waveform.play();
        });

        this.timeout = setTimeout(() => {
            this.waveform.drawBuffer();
        }, 1000)
    };

    componentWillUnmount() {
        clearTimeout(this.timeout);
        this.waveform.destroy();
    }

    handlePlay = () => {
        this.setState({ ...this.state, playing: !this.state.playing });
        this.waveform.playPause();
    };

    handleSlow = () => {
        let {speed} = this.state;

        speed = speed > 0.25 ? speed - 0.25 : speed;

        this.setState({ ...this.state, speed: speed });

        this.waveform.setPlaybackRate(speed);
    };

    handleFast = () => {
        let {speed} = this.state;

        speed = speed < 2 ? speed + 0.25 : speed;

        this.setState({ ...this.state, speed: speed });

        this.waveform.setPlaybackRate(speed);
    }

    resetSpeed = () => {
        this.setState({ ...this.state, speed: 1 });

        this.waveform.setPlaybackRate(1);
    }

    setVolume = ({y}) => {
        this.waveform.setVolume(y/100);
        this.setState({ ...this.state, volume: y })
    }

    render() {
        return (
            <div className={waveformStyles.audioPlayer}>
                <div className={waveformStyles.container}>
                    <div className={waveformStyles.waveContainer}>
                        <div className={waveformStyles.button} onClick={this.handlePlay}>
                            {
                                (this.state.playing && <PauseIcon width="100%" />) ||
                                (!this.state.playing && <PlayIcon width="100%" />)
                            }
                        </div>
                        <div className={waveformStyles.wave} id={`waveform-${this.props.id}-${this.state.nonce}`} />
                    </div>
                    <div className={waveformStyles.controls}>
                        <div className={waveformStyles.speed}>
                            <button className={formStyles.button + ' ' + formStyles.buttonSmall + ' ' + formStyles.buttonIcon}
                                    onClick={this.handleSlow}>
                                <BackwardIcon width={18} />
                            </button>
                            <label onClick={this.resetSpeed}>{this.state.speed}x</label>
                            <button className={formStyles.button + ' ' + formStyles.buttonSmall + ' ' + formStyles.buttonIcon}
                                    onClick={this.handleFast}>
                                <ForwardIcon width={18} />
                            </button>
                        </div>
                        {
                            this.state.time !== null && !this.state.time.startsWith('N') &&
                            <div className={waveformStyles.time}>
                                {this.state.time}
                            </div>
                        }
                    </div>
                </div>
                <div className={waveformStyles.volume}>
                    <Slider
                        axis="y"
                        styles={{
                            thumb: {
                                width: 15,
                                height: 15
                            },
                            track: {
                                width: 8,
                            },
                            active: {
                                backgroundColor: "#7286e9",
                                cursor: "pointer",
                            }
                        }}
                        yreverse={true}
                        ymin={0}
                        ymax={100}
                        ystep={1}
                        y={this.state.volume}
                        onChange={this.setVolume}
                    />
                </div>
            </div>
        );
    }
};

export default WaveformComponent;