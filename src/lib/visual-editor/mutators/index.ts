import {
  highlightElement,
  highlightElementsWithVariables,
  highlightElementWithVariable,
  unhighlightAllElements,
  unhighlightAllElementsWithVariables,
} from './highlighting';
import { setupClickListeners, setupListeners } from './listeners';
import { removeLocalStyles, setLocalStyles } from './localStyles';
import {
  markElementVariable,
  markElementVariables,
} from './markVariableSelector';
import { persistConfig } from './persistConfig';
import { persistMode } from './persistMode';
import { persistVisualVariables } from './persistVisualVariables';
import { setupUniqueElementIds } from './setupUniqueElementIds';
import {
  shuffleVariations,
  startVariableShuffle,
  stopVariableShuffle,
} from './shuffle';

export {
  unhighlightAllElementsWithVariables,
  unhighlightAllElements,
  highlightElement,
  setLocalStyles,
  setupClickListeners,
  setupListeners,
  removeLocalStyles,
  setupUniqueElementIds,
  markElementVariable,
  shuffleVariations,
  highlightElementWithVariable,
  stopVariableShuffle,
  startVariableShuffle,
  markElementVariables,
  highlightElementsWithVariables,
  persistMode,
  persistVisualVariables,
  persistConfig,
};
