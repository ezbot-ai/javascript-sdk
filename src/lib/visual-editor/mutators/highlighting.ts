/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-immutable-types */
/* eslint-disable functional/no-return-void */

import { logError } from '../../utils';
import { DBVariable } from '../types';
import * as utils from '../utils';

const elementHighlightClass = 'ezbot-element-highlight';
const elementWithVariableHighlightClass = 'ezbot-element-variable-highlight';

const unhighlightAllElements = (): void => {
  const highlightedElements = utils.safeQuerySelectorAll(
    `.${elementHighlightClass}`
  );

  if (!highlightedElements) {
    logError(new Error('No highlighted elements found'));
    return;
  }

  highlightedElements.forEach((element) => {
    if (!element || !(element instanceof HTMLElement)) {
      logError(
        new Error(
          'Element is not an instance of HTMLElement, cannot unhighlight'
        )
      );
      return;
    }
    (element as HTMLElement).style.border = '';
    (element as HTMLElement).style.backgroundColor = '';
    element.classList.remove(elementHighlightClass);
  });
};
const highlightElement = (element: HTMLElement): void => {
  element.classList.add(elementHighlightClass);
};

const highlightElementWithVariable = (element: HTMLElement): void => {
  element.classList.add(elementWithVariableHighlightClass);
};

const highlightElementsWithVariables = (variables: DBVariable[]): void => {
  variables.map((variable): void => {
    try {
      if (!variable.config) {
        logError(new Error('No config found for visual variable'));
        return;
      }
      // eslint-disable-next-line functional/no-let
      let element: HTMLElement | null;
      try {
        element = document.querySelector(variable.config.selector);
      } catch (e) {
        element = null;
      }

      // ignore unless element is found
      if (!element) {
        return;
      }
      highlightElementWithVariable(element as HTMLElement);
    } catch (error) {
      logError(new Error('Error highlighting element'));
    }
  });
};
export {
  highlightElement,
  unhighlightAllElements,
  highlightElementWithVariable,
  highlightElementsWithVariables,
};
