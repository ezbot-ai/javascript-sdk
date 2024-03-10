/* eslint-disable functional/no-return-void */
import { logError } from '../../utils';
import * as mutators from '../mutators';
import * as senders from '../senders';

const initEzbotMode = () => {
  try {
    mutators.setLocalStyles();
    mutators.setupClickListeners();
    mutators.setupUniqueElementIds();
    senders.sendInit('ready');
  } catch (e) {
    logError(e as Error);
    senders.sendInit('error');
  }
};
export { initEzbotMode };
