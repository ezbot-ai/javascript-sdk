/* eslint-disable functional/no-return-void */

import { OutboundEvent } from '../types';

function postEventToParent(event: Readonly<OutboundEvent>): void {
  window.parent.postMessage(event, '*');
}

function postMessageToParent(message: string): void {
  window.parent.postMessage(message, '*');
}

export { postMessageToParent, postEventToParent };
