/* eslint-disable functional/no-return-void */

import { logInfo } from '../../utils';
import { OutboundEvent } from '../types';

function postEventToParent(event: Readonly<OutboundEvent>): void {
  if (!window.top) {
    logInfo('No parent (top) window found. Skipping.');
    return;
  }
  const msg = JSON.stringify(event);
  postMessageToParent(msg);
}

function postMessageToParent(message: string): void {
  window.parent.postMessage(message, '*');
}

export { postEventToParent, postMessageToParent };
