/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import * as mutators from '../mutators';
import { Mode } from '../types';

const init = (mode: Mode) => {
  if (mode == 'ezbot') {
    logInfo(`Initializing mode ${mode}`);
    mutators.setLocalStyles();
    mutators.setupClickListeners();
    mutators.setupUniqueElementIds();
  } else {
    logInfo(`Mode ${mode} requires no mutations`);
  }
};

export { init };
