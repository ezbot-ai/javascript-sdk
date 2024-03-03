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
  setupHoverListeners();
};

export { setupClickListeners, setupIncomingMsgListener, setupListeners };
