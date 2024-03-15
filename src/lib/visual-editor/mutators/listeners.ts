/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import { routeIncomingEvent } from '../msg-router';
import { sendElementClicked } from '../senders/elementClicked';
import { parseIncomingMsg } from '../utils/parseIncomingMsg';
import * as validators from '../validators';

import { highlightElement, unhighlightAllElements } from './highlighting';

const setupIncomingMsgListener = () => {
  window.addEventListener('message', (msg: Readonly<MessageEvent>) => {
    logInfo('Received message: ', msg);

    if (!validators.inboundMsg(msg)) {
      logInfo('Event without a type was received. Skipping.');
      return;
    }
    const incomingEvent = parseIncomingMsg(msg);
    routeIncomingEvent(incomingEvent);
  });
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
