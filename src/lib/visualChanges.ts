/* eslint-disable functional/no-return-void */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-immutable-types */
import { Prediction } from './ezbot';

function setElementText(element: Element, text: string): void {
  element.textContent = text;
}

function setElementInnerHTML(element: Element, innerHTML: string): void {
  element.innerHTML = innerHTML;
}

function setElementAttribute(
  element: HTMLElement,
  attribute: string,
  value: string
) {
  element.setAttribute(attribute, value);
}

function addClassesToElement(element: HTMLElement, classes: string[]): void {
  if (classes.length === 0) {
    console.log(`No classes to add to element.`);
    return;
  }
  classes.forEach((className) => {
    element.classList.add(className);
  });
}
function removeClassesFromElement(
  element: HTMLElement,
  classes: string[]
): void {
  if (classes.length === 0) {
    console.log(`No classes to remove from element.`);
    return;
  }
  classes.forEach((className) => {
    element.classList.remove(className);
  });
}
function setElementStyle(element: HTMLElement, value: string): void {
  setElementAttribute(element, 'style', value);
}

function setElementHref(element: HTMLAnchorElement, href: string): void {
  setElementAttribute(element, 'href', href);
}

function setElementSrc(element: HTMLImageElement, src: string): void {
  setElementAttribute(element, 'src', src);
}

function hideElement(element: HTMLElement): void {
  element.style.display = 'none';
  element.style.visibility = 'hidden';
}
function showElement(element: HTMLElement): void {
  element.style.display = 'block';
  element.style.visibility = 'visible';
}

function validateVisualPrediction(prediction: Prediction): string | null {
  if (prediction.config == null) {
    return `No config found for prediction with key: ${prediction.key}. Skipping its visual change.`;
  }
  if (!prediction.config.selector) {
    return `No selector found for prediction with key: ${prediction.key}. Skipping its visual change.`;
  }
  if (!prediction.config.action) {
    return `No action found for prediction with key: ${prediction.key}. Skipping its visual change.`;
  }

  return null;
}
function parseCommaSeparatedList(list: string): string[] {
  // if list is empty, return an empty array
  if (list.length === 0) {
    return [];
  }
  // if list has no commas, return it as an array
  if (list.indexOf(',') === -1) {
    return [list];
  }
  const listArray = list.split(',').map((item) => item.trim());
  return listArray;
}

function makeVisualChange(prediction: Prediction): void {
  if (!prediction.config) {
    console.log(
      `No config found for prediction with key: ${prediction.key}. Skipping its visual change.`
    );
    return;
  }
  const selector = prediction.config.selector;
  if (!selector) {
    console.log(
      `No selector found for prediction with key: ${prediction.key}. Skipping its visual change.`
    );
    return;
  }

  const element = document.querySelector(selector);
  if (!element || !(element instanceof HTMLElement)) {
    console.log(
      `No HTML element found for prediction with key: ${prediction.key}. Skipping its visual change.`
    );
    return;
  }

  const action = prediction.config.action;

  switch (action) {
    case 'setText':
      setElementText(element, prediction.value);
      break;
    case 'setInnerHTML':
      setElementInnerHTML(element, prediction.value);
      break;
    case 'setAttribute':
      if (!prediction.config.attribute) {
        console.log(
          `No attribute found for prediction with key: ${prediction.key}. Skipping its visual change.`
        );
        return;
      }
      setElementAttribute(
        element,
        prediction.config.attribute,
        prediction.value
      );
      break;
    case 'addClasses':
      addClassesToElement(element, parseCommaSeparatedList(prediction.value));
      break;
    case 'removeClasses':
      removeClassesFromElement(
        element,
        parseCommaSeparatedList(prediction.value)
      );
      break;
    case 'setHref':
      if (element instanceof HTMLAnchorElement) {
        setElementHref(element, prediction.value);
      } else {
        console.log(
          `Element with selector: ${prediction.config.selector} is not an anchor element. Skipping its visual change.`
        );
      }
      break;
    case 'setStyle':
      setElementStyle(element, prediction.value);
      break;
    case 'setSrc':
      if (element instanceof HTMLImageElement) {
        setElementSrc(element, prediction.value);
      } else {
        console.log(
          `Element with selector: ${prediction.config.selector} is not an image element. Skipping its visual change.`
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
        `Unsupported action for prediction with key: ${prediction.key}. Skipping its visual change.`
      );
  }
}

function makeVisualChanges(): void {
  const predictions = window.ezbot?.predictions;
  if (!predictions) {
    console.log('No predictions found. Skipping visual changes.');
    return;
  }
  predictions.forEach((prediction) => {
    if (prediction.type != 'visual') {
      return;
    }

    const validationError = validateVisualPrediction(prediction);
    if (validationError != null) {
      console.log(validationError);
      return;
    }

    makeVisualChange(prediction);
  });
}
export {
  setElementText,
  setElementInnerHTML,
  setElementAttribute,
  setElementHref,
  setElementSrc,
  addClassesToElement,
  removeClassesFromElement,
  setElementStyle,
  hideElement,
  showElement,
  validateVisualPrediction,
  makeVisualChange,
  makeVisualChanges,
};
