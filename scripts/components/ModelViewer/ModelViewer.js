import '@components/ModelViewer/ModelViewer.scss';
import { getSource } from '@context/H5PContext';
import { purifyHTML } from '@utils/utils.js';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

/** @constant {number} FILE_PATH_TIMEOUT_MS File path setting timeout. */
const FILE_PATH_TIMEOUT_MS = 500;

const ModelViewer = (props) => {
  const {
    handleClick,
    hotspots,
    modelPath,
    id,
    showContentModal,
    contentId,
    mvInstance,
    modelDescriptionARIA,
  } = props;

  const [hs, sethotspots] = useState(null);
  const [filePath, setFilePath] = useState(null);

  const openModalByType = (hotspot, index) => {
    showContentModal(hotspot, index);
  };

  const POLLING_INTERVAL_MS = 500;
  const MAX_POLL_ATTEMPTS = 5;

  useEffect(() => {
    let pollCount = 0;
    let intervalId;

    const checkAndLoadOnTimeout = () => {
      if (window.modelViewerLoaded) {
        clearInterval(intervalId);
        return;
      }

      if (pollCount >= MAX_POLL_ATTEMPTS) {
        clearInterval(intervalId);
        import(/* webpackMode: "eager" */ '@google/model-viewer')
          .then(() => {
            window.modelViewerLoaded = true;
          })
          .catch((error) => {
            console.error('Error loading Model Viewer after timeout:', error);
          });
        return;
      }

      pollCount++;
    };

    if (!window.modelViewerLoaded) {
      intervalId = setInterval(checkAndLoadOnTimeout, POLLING_INTERVAL_MS);
    }

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setFilePath(null);
    const timeoutId = setTimeout(() => {
      sethotspots(hotspots);
      setFilePath(getSource(modelPath, contentId));
    }, FILE_PATH_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [hotspots]);
  return (
    <model-viewer
      id={id}
      onClick={handleClick}
      class='modelViewer'
      src={filePath}
      alt={purifyHTML(modelDescriptionARIA)}
      auto-rotate
      loading='eager'
      ar
      ar-scale='fixed'
      camera-controls
    >
      {hs &&
        mvInstance &&
        mvInstance.loaded &&
        hs.map((hotspot, index) => {
          return (
            hotspot.interactionpos && (
              <div
                className='hotspot'
                key={index}
                slot={`hotspot-${index}`}
                data-surface={hotspot.interactionpos}
              >
                <button
                  className={`hotspot h5p_${hotspot.action.metadata.contentType
                    .replace(/[ ,]+/g, '_')
                    .toLowerCase()}`}
                  aria-label={purifyHTML(hotspot.labelText)}
                  onClick={() => openModalByType(hotspot, index)}
                  onKeyDown={(event) => handleKeyDown(event, hotspot, index)}
                />
                <div className='hotspot-label'>{purifyHTML(hotspot.labelText)}</div>
              </div>
            )
          );
        })}
    </model-viewer>
  );
};

export default ModelViewer;

ModelViewer.propTypes = {
  id: PropTypes.string,
  contentId: PropTypes.string,
  modelDescriptionARIA: PropTypes.string,
  handleClick: PropTypes.func,
  hotspots: PropTypes.array,
  modelPath: PropTypes.string,
  showContentModal: PropTypes.func,
  mvInstance: PropTypes.object,
};
