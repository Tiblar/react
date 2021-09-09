import React from 'react'
import PropTypes from 'prop-types'
import plyr from 'plyr'
import 'plyr/dist/plyr.css'
import '../../css/components/plyr.css'

class PlyrComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.options.autoplay = this.props.autoplay;
        this.player = new plyr('.js-plyr', this.props.options)
        this.player.source = this.props.sources
    }

    componentWillUnmount() {
        this.player.destroy()
    }

    render() {
        return (
            <video autoPlay={this.props.autoplay} className='js-plyr plyr'>
            </video>
        )
    }
}

PlyrComponent.defaultProps = {
    autoplay: false,
    options: {
        controls: [
            'play',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'settings',
            'fullscreen',
        ],
        i18n: {
            restart: 'Restart',
            rewind: 'Rewind {seektime}s',
            play: 'Play',
            pause: 'Pause',
            fastForward: 'Forward {seektime}s',
            seek: 'Seek',
            seekLabel: '{currentTime} of {duration}',
            played: 'Played',
            buffered: 'Buffered',
            currentTime: 'Current time',
            duration: 'Duration',
            volume: 'Volume',
            mute: 'Mute',
            unmute: 'Unmute',
            enableCaptions: 'Enable captions',
            disableCaptions: 'Disable captions',
            download: 'Download',
            enterFullscreen: 'Enter fullscreen',
            exitFullscreen: 'Exit fullscreen',
            frameTitle: 'Player for {title}',
            captions: 'Captions',
            settings: 'Settings',
            menuBack: 'Go back to previous menu',
            speed: 'Speed',
            normal: 'Normal',
            quality: 'Quality',
            loop: 'Loop',
        },
        speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
        },
        ratio: '16:9',
        iconUrl: "/plyr/icons.svg",
        blankVideo: "/plyr/blank.mp4",
    },
}

PlyrComponent.propTypes = {
    options: PropTypes.object,
    sources: PropTypes.object,
    source: PropTypes.func,
    destroy: PropTypes.func,
    autoplay: PropTypes.bool,
}

export default PlyrComponent
