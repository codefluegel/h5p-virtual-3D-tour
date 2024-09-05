import { isGoToScene } from './libraryParams';

/** @typedef {{ playlistId: string, title: string, audioTracks: object }} Playlist */
/** @typedef {{ playlist: Playlist }} Model */
/** @typedef {{ yaw: number, pitch: number }} CameraPosition */

/**
 * Get model from id
 * @param {Model[]} models Models.
 * @param {number} modelId Model id.
 * @returns {Model} Model.
 */

export const ModelEditingType = {
  NOT_EDITING: null,
  NEW_MODEL: -1,
};

export const getModelFromId = (models, modelId) => {
  return models.find((model) => model.modelId === modelId);
};

/**
 * Delete model in parameters and deletes any GoToModel interactions
 * within other models that was pointing to the deleted model
 * @param {Model[]} models Models.
 * @param {number} modelId Model id.
 * @returns {Model[]} Models.
 */
export const deleteModel = (models, modelId) => {
  // Filter out the model
  const modelRemoved = models.filter((model) => model.modelId !== modelId);

  // Filter out any interactions pointing to the model
  return modelRemoved.map((model) => {
    const interactions = model.interactions;
    if (interactions) {
      model.interactions = interactions.filter((interaction) => {
        if (!isGoToScene(interaction)) {
          return true;
        }

        // Filter away GoToModel with the deleted model id
        return interaction.action.params.nextModelId !== modelId;
      });
    }

    return model;
  });
};

/**
 * Updates model within parameters.
 * @param {Model[]} models Models.
 * @param {object} params Parameters to be set.
 * @param {number|null} modelId Model id.
 * @returns {Model[]} Models with updated parameters.
 */
export const updateModel = (models, params, modelId = -1) => {
  if (modelId === ModelEditingType.NEW_MODEL) {
    models.push(params);
    return models;
  }

  return models.map((model) => {
    if (model.modelId === modelId) {
      // Replace model
      model = params;
    }

    return model;
  });
};

/**
 * Set model position in parameters.
 * @param {Model[]} models Models
 * @param {number} modelId Model id.
 * @param {CameraPosition} cameraPosition Camera position.
 */
export const setModelPositionFromCamera = (models, modelId, cameraPosition) => {
  const model = getModelFromId(models, modelId);
  model.cameraStartPosition = `${cameraPosition.yaw},${cameraPosition.pitch}`;
};
