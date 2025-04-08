import { extend, purifyHTML } from './utils.js';

/**
 * Sanitize the content type's parameters based on the semantics.json.
 * @param {object} params Parameters.
 * @returns {object} Sanitized parameters.
 */
export const sanitizeContentTypeParameters = (params = {}) => {
  params = extend(
    {
      modelViewerWidget: {
        models: [],
        startModelId: 0,
      },
      l10n: {
        'model-title': 'Model Viewer',
        close: 'Close',
        play: 'Play',
        pause: 'Pause',
      },
    },
    params
  );

  // Sanitize modelViewerWidget
  if (params.modelViewerWidget && Array.isArray(params.modelViewerWidget.models)) {
    params.modelViewerWidget.models = params.modelViewerWidget.models.map((model) => {
      const sanitizedModel = extend(
        {
          glbModel: {},
          modelId: undefined,
          modelName: undefined,
          interactions: [],
          modelDescriptionARIA: undefined,
        },
        model
      );

      // Sanitize modelName and modelDescriptionARIA
      sanitizedModel.modelName = purifyHTML(sanitizedModel.modelName);
      sanitizedModel.modelDescriptionARIA = purifyHTML(sanitizedModel.modelDescriptionARIA);

      // Sanitize interactions
      if (Array.isArray(sanitizedModel.interactions)) {
        sanitizedModel.interactions = sanitizedModel.interactions.map((interaction) => {
          const sanitizedInteraction = extend(
            {
              labelText: undefined,
              label: {
                labelPosition: 'inherit',
              },
              action: undefined,
              interactionpos: undefined,
            },
            interaction
          );

          // Sanitize labelText
          sanitizedInteraction.labelText = purifyHTML(sanitizedInteraction.labelText);

          return sanitizedInteraction;
        });
      }

      return sanitizedModel;
    });
  }
  if (params.modelViewerWidget && typeof params.modelViewerWidget.startModelId !== 'number') {
    params.modelViewerWidget.startModelId = 0;
  }

  // Sanitize localization
  if (params.l10n) {
    for (const key in params.l10n) {
      params.l10n[key] = purifyHTML(params.l10n[key]);
    }
  }

  return params;
};
