import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './components/Main';
import { H5PContext } from './context/H5PContext';

import { sanitizeContentTypeParameters } from './utils/sanitization';

export default class Wrapper extends H5P.EventDispatcher {
  constructor(params, contentId, extras = {}) {
    super('Virtual3DTour');

    this.params = sanitizeContentTypeParameters(params);
    this.contentId = contentId;
    this.extras = extras;

    this.params = this.params.modelViewerWidget;
  }

  render() {
    this.root = this.root ?? createRoot(this.wrapper);

    this.root.render(
      <H5PContext.Provider value={this}>
        <Main
          currentModel={this.currentModelId}
          paramInteractions={this.params.interactions}
          setCurrentModelId={this.setCurrentModelId.bind(this)}
        />
      </H5PContext.Provider>
    );

    window.requestAnimationFrame(() => {
      this.trigger('resize');
    });
  }

  /**
   * Set current model id.
   * @param {number} modelId Model id.
   */
  setCurrentModelId(modelId) {
    this.trigger('changedScene', modelId);
    this.currentModelId = modelId;
    this.render();
  }

  attach($container) {
    this.container = $container.get(0);

    this.currentModelId = 0;

    const createElements = () => {
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add('h5p-three-image');

      if (this.params.models.length) {
        this.currentModelId = this.params.startModelId;
        this.render();
      }

      this.isAttached = true;
    };

    /*
     * Temporary (fingers crossed) hotfix for Firefox on Edlib.
     * When overflow is set to `hidden` on Edlib (Why? H5P resizes the iframe
     * that the document lives in), then Firefox will not detect hotspots
     * as hovered/being clickable. Even with the `overflow` setting removed,
     * Firefox does require hotspots to be quite centered. When close to the
     * visible border of the scene, Firefox does not consider the hotspots
     * to be hovered/clicked.
     */
    document.body.style.overflow = '';

    if (!this.wrapper) {
      createElements();
    }

    // Append elements to DOM
    $container[0].appendChild(this.wrapper);
    $container[0].classList.add('h5p-three-image');
  }

  getRect() {
    return this.wrapper.getBoundingClientRect();
  }

  /**
   * Get current size ratio of wrapper.
   * @returns {number} Current size ratio of wrapper.
   */
  getRatio() {
    const rect = this.wrapper.getBoundingClientRect();
    return rect.width / rect.height;
  }

  resize() {
    if (!this.wrapper) {
      return;
    }

    const mobileThreshold = 815;
    const wrapperSize = this.wrapper.getBoundingClientRect();
    if (wrapperSize.width < mobileThreshold) {
      this.wrapper.classList.add('mobile');
    }
    else {
      this.wrapper.classList.remove('mobile');
    }
  }
}
