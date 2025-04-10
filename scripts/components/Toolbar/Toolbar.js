import '@components/Toolbar/Toolbar.scss';
import { H5PContext } from '@context/H5PContext.js';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';

const ToolBar = (props) => {
  const { animations, modelViewerInstance } = props;
  // buttonstate
  const [buttonState, setButtonState] = useState(false);
  const context = useContext(H5PContext);
  const playLabel = context.l10n?.play;
  const pauseLabel = context.l10n?.pause;

  const handlePlayPause = () => {
    setButtonState(!buttonState);

    if (modelViewerInstance) {
      modelViewerInstance.availableAnimations.length && modelViewerInstance.paused
        ? modelViewerInstance.play()
        : modelViewerInstance.pause();
    }
  };

  return (
    <button
      className='toolbar-btn'
      aria-label={buttonState ? pauseLabel : playLabel}
      onClick={handlePlayPause}
    >
      {buttonState ? pauseLabel : playLabel}
    </button>
  );
};

export default ToolBar;

ToolBar.propTypes = {
  animations: PropTypes.arrayOf(PropTypes.string).isRequired,
  modelViewerInstance: PropTypes.shape({
    availableAnimations: PropTypes.arrayOf(PropTypes.string).isRequired,
    paused: PropTypes.bool.isRequired,
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
  }),
};
