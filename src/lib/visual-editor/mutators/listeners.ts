/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import { routeIncomingEvent } from '../msg-router';
import { sendElementClicked } from '../senders/elementClicked';
import { parseIncomingMsg } from '../utils/parseIncomingMsg';
import * as validators from '../validators';

import { highlightElement, unhighlightAllElements } from './highlighting';

function initPort(e: Readonly<MessageEvent>) {
  if (!e.ports || e.ports.length == 0) {
    logInfo('No port was received. Skipping.');
    return;
  }
  const port2 = e.ports[0];
  // eslint-disable-next-line functional/immutable-data
  port2.onmessage = onMessage(e, port2);
}

const onMessage = (
  msg: Readonly<MessageEvent>,
  port: Readonly<MessagePort>
): null => {
  logInfo('Received message on port2: ', msg);
  if (!validators.inboundMsg(msg)) {
    logInfo('Event without a type was received. Skipping.');
    return null;
  }
  // port.postMessage(`Message received by IFrame: "${msg.data}"`);
  const incomingEvent = parseIncomingMsg(msg);
  routeIncomingEvent(incomingEvent);
  return null;
};

const setupIncomingMsgListener = () => {
  logInfo('Setting up incoming message listener');
  window.addEventListener('message', initPort);
};

const setupClickListeners = (): void => {
  document.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    unhighlightAllElements();
    highlightElement(element);
    sendElementClicked(element);
  });
};

const setupListeners = () => {
  setupIncomingMsgListener();
  setupClickListeners();
};

export { setupClickListeners, setupIncomingMsgListener, setupListeners };
