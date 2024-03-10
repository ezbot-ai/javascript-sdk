/* eslint-disable functional/no-return-void */
import { logError } from '../../utils';
import * as mutators from '../mutators';
import { buildLocalStyles } from '../mutators/localStyles';
import * as senders from '../senders';
import { SDKConfig } from '../types';

const initEzbotMode = (config: Readonly<SDKConfig>) => {
  try {
    const styles = buildLocalStyles(config);
    mutators.setLocalStyles(styles);
    mutators.setupClickListeners();
    mutators.setupUniqueElementIds();
    senders.sendInit('ready');
  } catch (e) {
    logError(e as Error);
    senders.sendInit('error');
  }
};
export { initEzbotMode };
