/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import { routeIncomingEvent } from '../msg-router';
import { sendElementClicked } from '../senders/elementClicked';
import { DBVariable } from '../types';
import { parseIncomingMsg } from '../utils/parseIncomingMsg';
import * as validators from '../validators';

import { highlightElement, unhighlightAllElements } from './highlighting';
import { hideTooltip, showTooltip } from './tooltip';

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

const setupHideToolTipListener = (element: Readonly<HTMLElement>): void => {
  element.addEventListener('mouseout', () => {
    hideTooltip();
  });
};

const setupShowToolTipListener = (element: Readonly<HTMLElement>): void => {
  element.addEventListener('mouseout', () => {
    showTooltip();
  });
};

const setupTooltipListeners = (variable: Readonly<DBVariable>): void => {
  if (!variable.config) {
    logInfo('No config for variable', variable);
    return;
  }
  const element = document.querySelector(variable.config.selector);
  if (!element) {
    logInfo('No element for variable', variable);
    return;
  }
  const readonlyElement = element as Readonly<HTMLElement>;
  setupHideToolTipListener(readonlyElement);
  setupShowToolTipListener(readonlyElement);
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

export {
  setupClickListeners,
  setupIncomingMsgListener,
  setupListeners,
  setupHideToolTipListener,
  setupShowToolTipListener,
  setupTooltipListeners,
};
