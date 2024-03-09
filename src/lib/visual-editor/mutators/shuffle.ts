/* eslint-disable functional/no-return-void */
import { animate } from 'motion';

import { logError, logInfo } from '../../utils';
import {
  addClassesToElement,
  hideElement,
  parseCommaSeparatedList,
  removeClassesFromElement,
  setElementAttribute,
  setElementHref,
  setElementInnerHTML,
  setElementSrc,
  setElementStyle,
  setElementText,
  showElement,
} from '../../visualChanges';
import { DBVariable, VisualVariableConfig } from '../types';

const shuffleSeconds = 3;
const animationSeconds = 1;

type VisualChange = {
  selector: string;
  config: VisualVariableConfig | null;
  value: string;
};

function makeVisualChange(change: Readonly<VisualChange>): void {
  const element = document.querySelector(change.selector);
  if (!element || !(element instanceof HTMLElement)) {
    console.log(
      `No HTML element found for prediction with selector: ${change.selector}. Skipping its shuffle.`
    );
    return;
  }

  switch (change.config?.action) {
    case 'setText':
      setElementText(element, change.value);
      break;
    case 'setInnerHTML':
      setElementInnerHTML(element, change.value);
      break;
    case 'setAttribute':
      if (!change.config?.attribute) {
        console.log(
          `No attribute found for prediction with selector: ${change.selector}. Skipping its visual change.`
        );
        return;
      }
      setElementAttribute(element, change.config.attribute, change.value);
      break;
    case 'addClasses':
      addClassesToElement(element, parseCommaSeparatedList(change.value));
      break;
    case 'removeClasses':
      removeClassesFromElement(element, parseCommaSeparatedList(change.value));
      break;
    case 'setHref':
      if (element instanceof HTMLAnchorElement) {
        setElementHref(element, change.value);
      } else {
        console.log(
          `Element with selector: ${change.selector} is not an anchor element. Skipping its visual change.`
        );
      }
      break;
    case 'setStyle':
      setElementStyle(element, change.value);
      break;
    case 'setSrc':
      if (element instanceof HTMLImageElement) {
        setElementSrc(element, change.value);
      } else {
        console.log(
          `Element with selector: ${change.selector} is not an image element. Skipping its visual change.`
        );
      }
      break;
    case 'hide':
      hideElement(element);
      break;
    case 'show':
      showElement(element);
      break;
    default:
      console.log(
        `Unsupported action for prediction with selector: ${change.selector}. Skipping its visual change.`
      );
  }
}

const shuffleVariations = (variable: Readonly<DBVariable>): void => {
  if (!variable.config) {
    logInfo('Cannot shuffle variations without variable config');
    return;
  }
  // eslint-disable-next-line functional/no-let
  let element: Element | null = null;
  try {
    element = document.querySelector(variable.config.selector);
  } catch (e) {
    logError(e as unknown as Error);
  }

  if (!element) {
    return;
  }

  const variations = [
    variable.defaultValue,
    ...variable.constraints.enumerables,
  ];

  if (variations.length == 0) {
    logInfo('No variations found for visual variable');
    return;
  }

  // every second, call makeVisualChange with a random variation
  // eslint-disable-next-line functional/no-let
  let counter = 0;
  const intervalId = setInterval(() => {
    makeVisualChange({
      selector: variable.config!.selector,
      config: variable.config,
      value: variations[counter],
    });
    animate(
      element!,
      {
        opacity: ['0', '1'],
        filter: ['blur(10px)', 'blur(0px)'],
      },
      {
        duration: animationSeconds,
        easing: 'ease-in-out',
      }
    );
    counter = (counter + 1) % variations.length;
  }, shuffleSeconds * 1000);
  // eslint-disable-next-line functional/immutable-data
  window.ezbot.intervals.push(intervalId as unknown as number);
};

const startVariableShuffle = (): void => {
  const variables = window.ezbot.visualVariables;
  variables.map(shuffleVariations);
};
const stopVariableShuffle = (): void => {
  window.ezbot.intervals.forEach((interval) => {
    clearInterval(interval);
  });
};

export { shuffleVariations, startVariableShuffle, stopVariableShuffle };
