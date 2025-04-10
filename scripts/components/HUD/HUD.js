import Button from '@components/HUD/Buttons/Button/Button';
import '@components/HUD/HUD.scss';
import { H5PContext } from '@context/H5PContext';
import PropTypes from 'prop-types';
import React from 'react';

export default class HUD extends React.Component {
  constructor(props) {
    super(props);

    this.buttons = {};
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
