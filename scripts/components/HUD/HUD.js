import React from 'react';
import Button from './Buttons/Button/Button';
import './HUD.scss';
import { H5PContext } from '../../context/H5PContext';
import PropTypes from 'prop-types';

export default class HUD extends React.Component {
  constructor(props) {
    super(props);

    this.buttons = {};
  }

  /**
   * Help pick the audio track for the given scene.
   * @param {object} scene Scene object.
   * @returns {object} Props for the audio track.
   */
  getSceneAudioTrack(scene) {
    const props = {
      isPlaying: this.props.audioIsPlaying,
      onIsPlaying: this.props.onAudioIsPlaying,
      isHiddenBehindOverlay: this.props.isHiddenBehindOverlay,
      nextFocus: this.props.nextFocus,
    };

    if (scene && scene.audio && scene.audio.length) {
      props.sceneAudioTrack = scene.audio;
      props.sceneId = scene.sceneId;
    }

    return props;
  }

  handleSceneDescription() {
    this.props.onSceneDescription(this.props.scene.scenedescription);
  }

  /**
   * React - create DOM elements
   * @returns {HTMLElement} React element.
   */
  render() {
    return (
      <div className='hud'>
        <div className='hud-bottom-left'>
          {this.props.showHomeButton && (
            <Button
              type={'go-to-start'}
              label={this.props.isStartModel ? 'You are at starting scene' : 'Go To Start Scene'}
              onClick={this.props.onGoToStartModel}
              disabled={this.props.isStartModel}
            />
          )}
        </div>
      </div>
    );
  }
}

HUD.contextType = H5PContext;

HUD.propTypes = {
  onGoToStartModel: PropTypes.func,
  showHomeButton: PropTypes.bool,
  isStartModel: PropTypes.bool,
  audioIsPlaying: PropTypes.string,
  onAudioIsPlaying: PropTypes.func,
  isHiddenBehindOverlay: PropTypes.bool,
  nextFocus: PropTypes.string,
  scene: PropTypes.object,
  onSceneDescription: PropTypes.func,
};
