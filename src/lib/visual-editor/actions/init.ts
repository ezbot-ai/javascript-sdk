import { logInfo } from '../../utils';
import * as actions from '../actions';
import { Mode } from '../types';

// eslint-disable-next-line functional/no-return-void
const initVisualEditorSupport = (mode: Mode) => {
  logInfo(`Initializing support for visual editor in mode: ${mode}`);
  if (mode == 'ezbot') {
    actions.initEzbotMode();
  } else {
    actions.initInteractiveMode();
  }
};

export { initVisualEditorSupport };
