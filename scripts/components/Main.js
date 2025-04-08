import Dialog from '@components/Dialog/Dialog.js';
import InteractionContent from '@components/Dialog/InteractionContent';
import HUD from '@components/HUD/HUD';
import LoadingSpinner from '@components/LoadingSpinner/LoadingSpinner.js';
import '@components/Main.scss';
import ModelViewer from '@components/ModelViewer/ModelViewer.js';
import ToolBar from '@components/Toolbar/Toolbar.js';
import { H5PContext } from '@context/H5PContext';
import { getModelFromId } from '@h5phelpers/modelParams.js';
import PropTypes from 'prop-types';
import React from 'react';

/** @constant {number} LOADING_SPINNER_TIMEOUT_SHORT_MS Short timeout to hide loading spinner. */
const LOADING_SPINNER_TIMEOUT_SHORT_MS = 500;

/** @constant {number} LOADING_SPINNER_TIMEOUT_MS Timeout to hide loading spinner. */
const LOADING_SPINNER_TIMEOUT_MS = 5000;

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modelPath: this.props.currentModel,
      currentModelId: this.props.currentModel,
      modelViewerInstance: null,
      animations: [],
      interactions: this.props.paramInteractions,
      showHotspotDialog: false,
      showInteractionDialog: false,
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
      setTimeout(() => {
        this.setState({
          loadingSpinner: false,
        });
      }, LOADING_SPINNER_TIMEOUT_MS);
    });
    setTimeout(() => {
      this.setState({
        loadingSpinner: false,
      });
    }, LOADING_SPINNER_TIMEOUT_MS);
  }

  componentDidUpdate() {
    // Check if a specific prop or state has changed to trigger the update logic
    const modelViewer = document.getElementById('model-viewer');

    if (!modelViewer) {
      return;
    }

    modelViewer.autoRotate = false;

    modelViewer.addEventListener('load', () => {
      // Create hotspots and set model viewer instance
      this.setState({
        loadingSpinner: false,
        interactions: this.state.interactions,
        modelViewerInstance: modelViewer,
        animations: modelViewer.availableAnimations,
      });

      setTimeout(() => {
        this.setState({
          loadingSpinner: false,
        });
      }, LOADING_SPINNER_TIMEOUT_SHORT_MS);
    });
    setTimeout(() => {
      this.setState({
        loadingSpinner: false,
      });
    }, LOADING_SPINNER_TIMEOUT_MS);
  }

  componentWillUnmount() {
    if (this.state.modelViewerInstance) {
      this.state.modelViewerInstance.removeEventListener('load', () => {
        this.setState({
          loadingSpinner: false,
          interactions: [],
          modelViewerInstance: null,
          animations: [],
        });
      });
    }
  }

  goToStartModel() {
    this.navigateToModel(this.context.params.startModelId);
    this.setState({
      loadingSpinner: false,
    });
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

  handleModelClick() {
    if (this.state.editingLibrary) {
      this.setState({
        showHotspotDialog: true,
      });
    }
  }

  hideInteraction() {
    this.setState(() => ({
      showInteractionDialog: false,
      hotspot: null,
    }));
  }

  showContentModal(hotspot) {
    const library = H5P.libraryFromString(hotspot.action.library);
    const machineName = library.machineName;

    if (machineName === 'H5P.GoToScene') {
      this.setState({
        currentInteraction: null,
      });

      const nextModelId = parseInt(hotspot.action.params.nextSceneId);
      this.navigateToModel(nextModelId);
    } 
    else {
      this.setState({
        showInteractionDialog: true,

        hotspot: hotspot,
        editingLibrary: hotspot.action.library,
      });
    }
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
          <Dialog onHideTextDialog={this.hideInteraction.bind(this)} dialogClasses={dialogClasses}>
            <InteractionContent hotspot={this.state.hotspot} />
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
              modelDescriptionARIA={model.modelDescriptionARIA}
            />
            {this.state.animations.length > 0 && !this.state.showInteractionDialog && (
              <ToolBar
                animations={this.state.animations}
                modelViewerInstance={this.state.modelViewerInstance}
              />
            )}
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
  currentModel: PropTypes.number,
  setCurrentModelId: PropTypes.func,
  paramInteractions: PropTypes.array,
};
