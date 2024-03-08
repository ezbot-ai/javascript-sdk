/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-immutable-types */
/* eslint-disable functional/no-return-void */

import { logError } from '../../utils';

const elementHighlightClass = 'ezbot-element-highlight';
const elementWithVariableHighlightClass = 'ezbot-element-variable-highlight';

const unhighlightAllElements = (): void => {
  const highlightedElements = document.querySelectorAll(
    `.${elementHighlightClass}`
  );

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

export {
  highlightElement,
  unhighlightAllElements,
  highlightElementWithVariable,
};
