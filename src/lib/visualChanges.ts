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

function makeVisualChange(prediction: Prediction): void {
  const element = document.querySelector(prediction.config.selector);
  if (!element) {
    console.log(
      `No element found for prediction with key: ${prediction.key}. Skipping its visual change.`
    );
    return;
  }
  const action = prediction.config.action;
  if (action === 'setText') {
    setElementText(element, prediction.value);
  }
  if (action === 'setInnerHTML') {
    setElementInnerHTML(element, prediction.value);
  }
  if (action === 'setHref') {
    if (element instanceof HTMLAnchorElement) {
      setElementHref(element, prediction.value);
    } else {
      console.log(
        `Element with selector: ${prediction.config.selector} is not an anchor element. Skipping its visual change.`
      );
    }
  }
  if (action === 'setSrc') {
    if (!(element instanceof HTMLImageElement)) {
      console.log(
        `Element with selector: ${prediction.config.selector} is not an image element. Skipping its visual change.`
      );
      return;
    }
    setElementSrc(element, prediction.value);
  }
  if (action === 'hide') {
    if (!(element instanceof HTMLElement)) {
      console.log(
        `Element with selector: ${prediction.config.selector} is not an HTML element. Skipping its visual change.`
      );
      return;
    }
    hideElement(element);
  }
  if (action === 'show') {
    if (!(element instanceof HTMLElement)) {
      console.log(
        `Element with selector: ${prediction.config.selector} is not an HTML element. Skipping its visual change.`
      );
      return;
    }
    showElement(element);
  } else {
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
  hideElement,
  showElement,
  validateVisualPrediction,
  makeVisualChange,
  makeVisualChanges,
};
