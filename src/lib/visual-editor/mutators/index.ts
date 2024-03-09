import {
  highlightElement,
  highlightElementWithVariable,
  unhighlightAllElements,
} from './highlighting';
import {
  setupClickListeners,
  setupIncomingMsgListener,
  setupListeners,
} from './listeners';
import { removeLocalStyles, setLocalStyles } from './localStyles';
import { markElementVariable } from './markVariableSelector';
import { setupUniqueElementIds } from './setupUniqueElementIds';
import {
  shuffleVariations,
  startVariableShuffle,
  stopVariableShuffle,
} from './shuffle';

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
  shuffleVariations,
  highlightElementWithVariable,
  stopVariableShuffle,
  startVariableShuffle,
};
