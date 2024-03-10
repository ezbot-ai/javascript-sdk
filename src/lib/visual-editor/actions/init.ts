import { logInfo } from '../../utils';
import * as actions from '../actions';
import * as mutators from '../mutators';
import { Mode, SDKConfig } from '../types';

// eslint-disable-next-line functional/no-return-void
const initVisualEditorSupport = (mode: Mode, config: Readonly<SDKConfig>) => {
  logInfo(`Initializing support for visual editor in mode: ${mode}`);
  mutators.persistMode(mode);
  mutators.persistConfig(config);
  if (mode == 'ezbot') {
    actions.initEzbotMode(config);
  } else {
    actions.initInteractiveMode();
  }
};

export { initVisualEditorSupport };
