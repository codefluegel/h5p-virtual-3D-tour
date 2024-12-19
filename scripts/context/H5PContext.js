import React from 'react';

/**
 * Get absolute path to image from relative parameters path
 * @param {string} path Relative path as found in content parameters
 * @param {string} contentId Content id.
 * @returns {string} Absolute path to image
 */
export const getSource = (path, contentId) => {
  return H5P.getPath(path, contentId);
};

export const getInteractionsField = (field) => {
  const modelFields = getModelField(field);

  return H5P.Virtual3DTour.findSemanticsField('interactions', modelFields);
};

export const getModelField = (field) => {
  return H5P.Virtual3DTour.findSemanticsField('modelViewerWidget', field);
};

export const getLibraries = async (field) => {
  const actionField = H5P.Virtual3DTour.findSemanticsField('action', getInteractionsField(field));

  return new Promise((resolve) => {
    H5P.Virtual3DTour.LibraryListCache.getLibraries(actionField.options, (libraries) => {
      resolve(libraries);
    });
  });
};

export const H5PContext = React.createContext(null);
