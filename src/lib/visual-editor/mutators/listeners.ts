/* eslint-disable functional/no-return-void */
import { sendElementClicked } from '../senders/elementClicked';

import { highlightElement, unhighlightAllElements } from './highlighting';

const setupClickListeners = () => {
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
  setupClickListeners();
};

export { setupClickListeners, setupListeners };
