import React from 'react';
import PropTypes from 'prop-types';
import './Main.scss';
import { H5PContext } from '../context/H5PContext';
import ModelViewer from './ModelViewer/ModelViewer';
import Dialog from './Dialog/Dialog';
import InteractionContent from './Dialog/InteractionContent';
import { getModelFromId } from '../h5phelpers/modelParams.js';
import HUD from './HUD/HUD';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner.js';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.audioPlayers = {};

    this.state = {
      modelPath: this.props.currentModel,
      currentModelId: this.props.currentModel,
      modelViewerInstance: null,
      animations: [],
      interactions: this.props.paramInteractions,
      showHotspotDialog: false,
      showInteractionDialog: false,
      audioIsPlaying: null,
      loadingSpinner: false,
    };
  }

  componentDidMount() {
    const modelViewer = document.getElementById('model-viewer');
    if (!modelViewer) {
      return;
    }
    modelViewer.autoRotate = false;

    modelViewer.addEventListener('load', () => {
      // create hotspots and set model viewer instance

      this.setState({
        loadingSpinner: false,
        interactions: this.state.interactions,
        modelViewerInstance: modelViewer,
        animations: modelViewer.availableAnimations,
      });
    });
  }

  componentWillUnmount() {
    // remove event listener
    this.state.modelViewerInstance.removeEventListener('load');
  }

  /**
   * Get the audio player for the current track.
   *
   * @param {string} id
   * @param {Object} [hotspot] Parameters (Only needed initially)
   * @return {AudioElement} or 'null' if track isn't playable.
   */
  getAudioPlayer(id, hotspot) {
    // Create player if none exist
    if (this.audioPlayers[id] === undefined) {
      if (
        !hotspot ||
        !hotspot.action ||
        !hotspot.action.params ||
        !hotspot.action.params.files ||
        !hotspot.action.params.files.length
      ) {
        return; // No track to play
      }
      this.audioPlayers[id] = AudioButton.createAudioPlayer(
        this.context.contentId,
        hotspot.action.params.files,
        () => {
          this.setState({
            audioIsPlaying: id, // Set state on starting to play
          });
        },
        () => {
          if (this.state.audioIsPlaying === id) {
            this.setState({
              audioIsPlaying: null, // Clear state on playing ended
            });
          }
        },
        false
      );
    }
    return this.audioPlayers[id];
  }

  goToStartModel() {
    this.navigateToModel(this.context.params.startModelId);
  }

  navigateToModel(modelId) {
    let nextModelId = null;

    nextModelId = this.context.params.models.find((model) => {
      return model.modelId === modelId;
    }).modelId;

    this.setState({
      loadingSpinner: true, // Clear state on playing ended
    });

    this.props.setCurrentModelId(nextModelId);
  }

  handleModelClick(event) {
    // retrieve clicked point on 3D Model from model-viewer instance
    if (this.state.editingLibrary) {
      const clickedPoint = this.state.modelViewerInstance.surfaceFromPoint(
        event.clientX,
        event.clientY
      );

      this.setState({
        //showHotspotDialog: true,
      });
    }
  }

  // handle play/pause of animations contained by the model
  handlePlayPause() {
    const { modelViewerInstance } = this.state;

    if (modelViewerInstance.paused) {
      modelViewerInstance.play();
    } else {
      modelViewerInstance.pause();
    }
  }

  handleCloseTextDialog() {
    this.setState({
      showHotspotDialog: false,
      currentText: null,
    });
  }

  hideInteraction() {
    this.setState((prevState) => ({
      showInteractionDialog: false,
      hotspot: null,
    }));
  }

  handleAudioIsPlaying(id) {
    this.setState({
      audioIsPlaying: id, // Change the player
    });
  }

  showContentModal(hotspot, index) {
    const library = H5P.libraryFromString(hotspot.action.library);
    const machineName = library.machineName;

    if (machineName === 'H5P.GoToScene') {
      this.setState({
        currentInteraction: null,
      });

      const nextModelId = parseInt(hotspot.action.params.nextSceneId);
      this.navigateToModel(nextModelId);
    } else if (hotspot.action.metadata.contentType !== 'Text') {
      const playerId = 'interaction' + '-' + index;
      if (this.state.audioIsPlaying === playerId) {
        // Pause and reset player
        const lastPlayer = this.getAudioPlayer(playerId, hotspot);
        if (lastPlayer) {
          lastPlayer.pause();
          lastPlayer.currentTime = 0;
        }
      } else {
        // Start current audio playback
        const player = this.getAudioPlayer(playerId, hotspot);
        if (player) {
          player.play();
        }
      }

      this.setState({
        showInteractionDialog: true,
      });
    } else {
      this.setState({
        showInteractionDialog: true,
      });
    }

    this.setState({
      hotspot: hotspot,
      editingLibrary: hotspot.action.library,
    });
  }

  render() {
    let dialogClasses = [];
    if (this.state.showInteractionDialog) {
      const library = H5P.libraryFromString(this.state.hotspot.action.library);
      const interactionClass = library.machineName.replace('.', '-').toLowerCase();

      dialogClasses.push(interactionClass);
    }

    const model = getModelFromId(this.context.params.models, this.props.currentModel);
    const isStartModel = this.props.currentModel === this.context.params.startModelId;

    return (
      <div className='model-viewer-container'>
        {this.state.showInteractionDialog && (
          <Dialog
            title={'Test'}
            onHideTextDialog={this.hideInteraction.bind(this)}
            dialogClasses={dialogClasses}
          >
            <InteractionContent
              hotspot={this.state.hotspot}
              audioIsPlaying={this.state.audioIsPlaying}
              onAudioIsPlaying={this.handleAudioIsPlaying.bind(this)}
            />
          </Dialog>
        )}
        <div className='container'>
          <div className='mv-container'>
            <ModelViewer
              id={'model-viewer'}
              contentId={this.context.contentId}
              handleClick={this.handleModelClick.bind(this)}
              hotspots={model.interactions}
              modelPath={model.glbModel.path}
              showContentModal={this.showContentModal.bind(this)}
              mvInstance={this.state.modelViewerInstance}
            />
            <HUD
              onGoToStartModel={this.goToStartModel.bind(this)}
              showHomeButton={true}
              isStartModel={isStartModel}
            />
            {this.state.loadingSpinner && <LoadingSpinner />}
          </div>
        </div>
      </div>
    );
  }
}

Main.contextType = H5PContext;

Main.propTypes = {
  modelPath: PropTypes.string,
};
