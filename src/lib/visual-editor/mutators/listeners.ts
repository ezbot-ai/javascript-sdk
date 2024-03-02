/* eslint-disable functional/no-return-void */
import { routeIncomingEvent } from '../msg-router';
import { buildElementClickedPayload, postEventToParent } from '../senders';
import { parseIncomingMsg } from '../utils/parseIncomingMsg';
import * as validators from '../validators';

const setupIncomingMsgListener = () => {
  window.addEventListener('message', (msg: Readonly<MessageEvent>) => {
    if (!validators.inboundMsg(msg)) {
      return;
    }
    const incomingEvent = parseIncomingMsg(msg);
    routeIncomingEvent(incomingEvent);
  });
};

const setupClickListeners = (): void => {
  document.addEventListener('click', (event) => {
    const element = event.target as HTMLElement;
    const elementPayload = buildElementClickedPayload(element);
    // TODO: Move this logic
    document.querySelectorAll('.ezbot-highlight').forEach((el) => {
      el.classList.remove('ezbot-highlight');
    });
    element.classList.add('ezbot-highlight');
    postEventToParent(elementPayload);
  });
};

const setupListeners = () => {
  setupIncomingMsgListener();
  setupClickListeners();
};

export { setupClickListeners, setupIncomingMsgListener, setupListeners };
