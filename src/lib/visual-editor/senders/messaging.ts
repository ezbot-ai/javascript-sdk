/* eslint-disable functional/no-return-void */

import { OutboundEvent } from '../types';

function postEventToParent(event: Readonly<OutboundEvent>): void {
  console.log('posting event to parent', event);
  window.parent.postMessage(event, '*');
}

// TODO: Remove me?
function postMessageToParent(message: string): void {
  console.log('posting message to parent', message);
  window.parent.postMessage(message, '*');
}

export { postMessageToParent, postEventToParent };
