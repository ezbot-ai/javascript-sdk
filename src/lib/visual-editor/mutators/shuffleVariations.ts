/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
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

  const element = document.querySelector(variable.config.selector);

  if (!element) {
    logInfo('No element found for visual variable');
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
  setInterval(() => {
    makeVisualChange({
      selector: variable.config!.selector,
      config: variable.config,
      value: variations[counter],
    });
    counter = (counter + 1) % variations.length;
  }, 2000);
};

export { shuffleVariations };