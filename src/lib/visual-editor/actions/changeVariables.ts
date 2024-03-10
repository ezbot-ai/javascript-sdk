/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import * as mutators from '../mutators';
import { DBVariable } from '../types';
import * as utils from '../utils';

const setupVisualVariable = (variable: Readonly<DBVariable>): void => {
  try {
    // Check for a malformed variable with type 'visual' but no config
    if (!variable.config) {
      logInfo('No config found for visual variable');
      return;
    }

    // Find an element using the selector from the variable config
    const element = utils.safeQuerySelector(variable.config.selector);

    // If no element is found, return early
    if (!element) {
      return;
    }

    // Mark the element with the variable and highlight it
    mutators.markElementVariable(element as HTMLElement, variable);
    mutators.highlightElementWithVariable(element as HTMLElement);
    // Begin shuffling its variations
    mutators.shuffleVariations(variable);
  } catch (error) {
    logInfo('Error highlighting element', error);
  }
};
const setupVisualVariables = (visualVariables: readonly DBVariable[]): void => {
  visualVariables.map((variable): void => {
    setupVisualVariable(variable);
  });
};

const changeVariables = (variables: readonly DBVariable[]) => {
  mutators.persistVisualVariables(variables);
  const mode = window.ezbot.mode;

  // If the mode is 'interactive', return early
  if (mode === 'interactive') {
    return;
  }

  const visualVariables = window.ezbot.visualVariables;
  setupVisualVariables(visualVariables);
};

export { changeVariables, setupVisualVariable, setupVisualVariables };
