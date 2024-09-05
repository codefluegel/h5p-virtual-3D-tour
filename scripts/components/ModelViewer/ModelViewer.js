import React, { useEffect, useState } from 'react';
import { getSource } from '../../context/H5PContext';

const ModelViewer = (props) => {
  const { handleClick, hotspots, modelPath, id, showContentModal, contentId, mvInstance } = props;

  const openModalByType = (hotspot, index) => {
    showContentModal(hotspot, index);
  };

  const [hs, sethotspots] = useState(null);
  const [filePath, setFilePath] = useState(null);

  useEffect(() => {
    setFilePath(null);
    const timeoutId = setTimeout(() => {
      sethotspots(hotspots);
      setFilePath(getSource(modelPath, contentId));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [hotspots]);

  return (
    <model-viewer
      id={id}
      onClick={handleClick}
      style={{ width: '100%', height: '100%' }}
      src={filePath}
      alt='Virtual 3D Tour Model'
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
                className={`hotspot h5p_${hotspot.action.metadata.contentType
                  .replace(/[ ,]+/g, '_')
                  .toLowerCase()}`}
                key={index}
                slot={`hotspot-${index}`}
                data-surface={hotspot.interactionpos}
                onClick={() => openModalByType(hotspot, index)}
              >
                <span className='hotspot-label' onClick={() => openModalByType(hotspot, index)}>
                  {`${index + 1}. ${hotspot.labelText}`}{' '}
                </span>
              </div>
            )
          );
        })}
    </model-viewer>
  );
};

export default ModelViewer;
