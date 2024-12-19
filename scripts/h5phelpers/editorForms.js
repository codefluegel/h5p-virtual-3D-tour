import { getLibraries } from '../context/H5PContext';

/**
 * Get scenes field from Three Image semantics structure.
 * @param {string} field Name of the field we wish to find.
 * @returns {null|object} Field if found, otherwise null.
 */
export const getModelField = (field) => {
  return H5PEditor.findSemanticsField('modelViewerWidget', field);
};

/**
 * Get interactions field within a scene from the Three Image semantics
 * structure.
 * @param {string} field Name of the field we wish to find.
 * @returns {null|object} Field if found, otherwise null.
 */
export const getInteractionsField = (field) => {
  const modelFields = getModelField(field);

  return H5PEditor.findSemanticsField('interactions', modelFields);
};

/**
 * Get library data for a single library
 * @param {object} field Field object.
 * @param {string} library Library name
 * @returns {Promise<*>} Library data.
 */
export const getLibraryDataFromFields = async (field, library) => {
  const libraries = await getLibraries(field);
  return libraries.find((lib) => {
    return lib.uberName === library;
  });
};

/**
 * Checks if children are valid and sets error messages for invalid fields.
 * @param {object[]} children Children to validate.
 * @returns {boolean} True if all children are valid.
 */
export const isChildrenValid = (children) => {
  let isInputsValid = true;

  // validate() should always run for all children because it adds
  // styling to children that fails to validate
  children.forEach((child) => {
    // Special validation for scene image, since having a required image
    // is not supported by core yet
    const isRequiredImage =
      child.field.type === 'image' &&
      (child.field.optional === undefined || child.field.optional === false);
    if (isRequiredImage) {
      if (!child.params || !child.params.path) {
        isInputsValid = false;
      }
    }

    // Note that validate() does not necessarily return a bool...
    // e.g. for texts it returns the string
    const isChildValid = child.validate();
    if (isChildValid === false) {
      isInputsValid = false;
    }
  });

  return isInputsValid;
};

const addBehavioralChangeListeners = (parent, callback) => {
  const behaviour = parent.children.find((child) => {
    return child.field.name === 'behaviour';
  });

  const sceneRendering = behaviour.children.find((child) => {
    return child.field.name === 'sceneRenderingQuality';
  });

  const label = behaviour.children.find((child) => {
    return child.field.name === 'label';
  });

  for (let i = 0; i < label.children.length; i++) {
    label.children[i].changes.push(callback);
  }

  sceneRendering.changes.push(callback);
};

export const addBehavioralListeners = (parent, callback) => {
  if (parent.children.length === 0) {
    parent.ready(() => {
      addBehavioralChangeListeners(parent, callback);
    });
    return;
  }
  addBehavioralChangeListeners(parent, callback);
};
