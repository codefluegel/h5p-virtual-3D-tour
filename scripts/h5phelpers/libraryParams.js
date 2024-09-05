export const Libraries = {
  GoToScene: {
    machineName: 'H5P.GoToScene',
  },
};

/**
 * Get default params for a library
 *
 * @param uberName
 * @returns {{interactionpos: string, action: {library: *, params: {}}}}
 */
export const getDefaultLibraryParams = (uberName) => {
  return {
    interactionpos: '', // Filled in on saving interaction
    action: {
      library: uberName,
      params: {},
    },
  };
};

/**
 * Checks if an interaction is a GoToScene library
 *
 * @param interaction
 * @returns {boolean}
 */
export const isGoToScene = (interaction) => {
  const library = H5P.libraryFromString(interaction.action.library);
  return library.machineName === Libraries.GoToScene.machineName;
};
