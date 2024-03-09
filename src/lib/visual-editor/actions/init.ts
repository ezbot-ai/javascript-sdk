import { logError, logInfo } from '../../utils';
import * as mutators from '../mutators';
import * as senders from '../senders';
import { Mode } from '../types';

// eslint-disable-next-line functional/no-return-void
const initVisualEditorSupport = (mode: Mode) => {
  logInfo(`Initializing support for visual editor in mode: ${mode}`);
  if (mode == 'ezbot') {
    try {
      mutators.setLocalStyles();
      mutators.setupClickListeners();
      mutators.setupUniqueElementIds();
      const visualVariables = window.ezbot.visualVariables;
      mutators.startVariableShuffle(visualVariables);
      senders.sendInit('ready');
    } catch (e) {
      logError(e as Error);
      senders.sendInit('error');
    }
  } else {
    mutators.stopVariableShuffle();
    mutators.setupUniqueElementIds();
    senders.sendInit('ready');
  }
};

export { initVisualEditorSupport };
