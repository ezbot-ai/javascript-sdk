import { logError, logInfo } from '../../utils';
import * as mutators from '../mutators';
import * as senders from '../senders';
import { Mode } from '../types';

// eslint-disable-next-line functional/no-return-void
const initVisualEditorSupport = (mode: Mode) => {
  if (mode == 'ezbot') {
    try {
      logInfo(`Initializing mode ${mode}`);
      mutators.setLocalStyles();
      mutators.setupClickListeners();
      mutators.setupUniqueElementIds();
      senders.sendInit('ready');
    } catch (e) {
      logError(e as Error);
      senders.sendInit('error');
    }
  } else {
    logInfo(`Mode ${mode} requires no mutations`);
  }
};

export { initVisualEditorSupport };
