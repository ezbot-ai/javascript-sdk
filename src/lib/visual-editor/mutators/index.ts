import { highlightElement, unhighlightAllElements } from './highlighting';
import {
  setupClickListeners,
  setupIncomingMsgListener,
  setupListeners,
} from './listeners';
import { removeLocalStyles, setLocalStyles } from './localStyles';
import { markElementVariable } from './markVariableSelector';
import { setupUniqueElementIds } from './setupUniqueElementIds';

export {
  unhighlightAllElements,
  highlightElement,
  setLocalStyles,
  setupClickListeners,
  setupIncomingMsgListener,
  setupListeners,
  removeLocalStyles,
  setupUniqueElementIds,
  markElementVariable,
};
