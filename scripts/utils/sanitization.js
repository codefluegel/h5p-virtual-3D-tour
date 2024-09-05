import { extend, purifyHTML } from './utils.js';

/**
 * Set interaction defaults.
 * @param {object} interactions Scene parameters.
 * @returns {object} Sanitized scene parameters.
 */
const setInteractionDefaults = (interactions) => {
  interactions = interactions.map((interaction) => {
    interaction = extend(
      {
        label: {
          labelPosition: 'inherit',
          showLabel: 'inherit',
        },
        ...(interaction.showAsHotspot && {
          hotspotSettings: {
            isHotspotTabbable: true,
            hotSpotSizeValues: '256,128',
          },
          iconTypeTextBox: 'text-icon',
        }),
      },
      interaction
    );

    // Add unique id as key for mapping React components.
    if (!interaction.id) {
      interaction.id = H5P.createUUID();
    }

    return interaction;
  });

  return interactions;
};

/**
 * Sanitize the content type's parameters.
 * @param {object} params Parameters.
 * @returns {object} Sanitized parameters.
 */
export const sanitizeContentTypeParameters = (params = {}) => {
  params = extend(
    {
      glbModel: {},
      modelViewerWidget: {
        interactions: [],
      },
      behaviour: {
        audioType: 'audio',
        showScoresButton: false,
        showHomeButton: true,
        sceneRenderingQuality: 'high',
        label: {
          labelPosition: 'right',
          showLabel: true,
        },
      },
      l10n: {
        title: 'Virtual Tour',
        playAudioTrack: 'Play Audio Track',
        pauseAudioTrack: 'Pause Audio Track',
        sceneDescription: 'Scene Description',
        resetCamera: 'Reset Camera',
        submitDialog: 'Submit Dialog',
        closeDialog: 'Close Dialog',
        expandButtonAriaLabel: 'Expand the visual label',
        goToStartScene: 'Go to start scene',
        userIsAtStartScene: 'You are at the start scene',
        unlocked: 'Unlocked',
        locked: 'Locked',
        searchRoomForCode: 'Search the room until you find the code',
        wrongCode: 'The code was wrong, try again.',
        contentUnlocked: 'The content has been unlocked!',
        code: 'Code',
        showCode: 'Show code',
        hideCode: 'Hide code',
        unlockedStateAction: 'Continue',
        lockedStateAction: 'Unlock',
        hotspotDragHorizAlt: 'Drag horizontally to scale hotspot',
        hotspotDragVertiAlt: 'Drag vertically to scale hotspot',
        backgroundLoading: 'Loading background image...',
        noContent: 'No content',
        hint: 'Hint',
        lockedContent: 'Locked content',
        back: 'Back',
        buttonFullscreenEnter: 'Enter fullscreen mode',
        buttonFullscreenExit: 'Exit fullscreen mode',
        noValidScenesSet: 'No valid scenes have been set.',
        buttonZoomIn: 'Zoom in',
        buttonZoomOut: 'Zoom out',
        zoomToolbar: 'Zoom toolbar',
        zoomAria: ':num% zoomed in',
      },
    },
    params
  );

  // Sanitize localization
  for (const key in params.l10n) {
    params.l10n[key] = purifyHTML(params.l10n[key]);
  }

  return params;
};
