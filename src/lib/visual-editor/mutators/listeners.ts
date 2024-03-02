/* eslint-disable functional/no-return-void */
import { routeIncomingEvent } from '../msg-router';
import { buildElementClickedPayload, postEventToParent } from '../senders';

const setupIncomingMsgListener = () => {
  window.addEventListener('message', (msg: Readonly<MessageEvent>) => {
    const incomingEvent = parseIncomingMsg(msg);
    routeIncomingEvent(incomingEvent);
  });
};

const setupClickListeners = (): void => {
  document.addEventListener('click', (event) => {
    const element = event.target as HTMLElement;
    const elementPayload = buildElementClickedPayload(element);
    postEventToParent(elementPayload);
  });
};

const setupListeners = () => {
  setupIncomingMsgListener();
  setupClickListeners();
};

export { setupClickListeners, setupIncomingMsgListener, setupListeners };
