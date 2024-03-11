/* eslint-disable functional/no-return-void */
import * as senders from '../senders';

const initInteractiveMode = () => {
  senders.sendInit('ready');
};

export { initInteractiveMode };
