/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import { routeIncomingEvent } from '../msg-router';
import { sendElementClicked } from '../senders/elementClicked';
import { parseIncomingMsg } from '../utils/parseIncomingMsg';
import * as validators from '../validators';

import { highlightElement, unhighlightAllElements } from './highlighting';

const setupIncomingMsgListener = () => {
  window.addEventListener('message', (msg: Readonly<MessageEvent>) => {
    if (!validators.inboundMsg(msg)) {
      logInfo('Invalid incoming message', msg);
      return;
    }
    const incomingEvent = parseIncomingMsg(msg);
    routeIncomingEvent(incomingEvent);
  });
};

const setupHoverListeners = (): void => {
  // TODO: Tweak and re-enable?
  // document.addEventListener('mouseover', (event) => {
  //   const element = event.target as HTMLElement;
  //   // TODO: Move this logic
  //   document.querySelectorAll('.ezbot-hover').forEach((el) => {
  //     el.classList.remove('ezbot-hover');
  //   });
  //   element.classList.add('ezbot-hover');
  // });
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
  setupHoverListeners();
};

export { setupClickListeners, setupIncomingMsgListener, setupListeners };
