/* eslint-disable functional/no-return-void */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-immutable-types */
import { globalVisualChanges } from './constants';
import { Prediction } from './ezbot';
import { guard } from './shutdown';
import * as utils from './utils';
import { logInfo } from './utils';

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
    utils.logInfo(`No classes to add to element.`);
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
    utils.logInfo(`No classes to remove from element.`);
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
function setElementOuterHTML(element: HTMLElement, value: string): void {
  element.outerHTML = value;
}
function addGlobalCSS(key: string, value: string): void {
  const head = document.head;
  if (!head) {
    logInfo('No document head found: unable to add global css');
    return;
  }
  const newStyleElement = document.createElement('style');
  newStyleElement.innerText = value;
  newStyleElement.id = 'ezbot-global-css-' + key;
  head.appendChild(newStyleElement);
}
function validateVisualPrediction(prediction: Prediction): string | null {
  if (prediction.config == null) {
    return `No config found for prediction with key: ${prediction.key}. Skipping its visual change.`;
  }
  if (prediction.config.action === 'addGlobalCSS') {
    return null;
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

function makeGlobalVisualChange(prediction: Prediction): void {
  const action = prediction.config?.action;

  switch (action) {
    case 'addGlobalCSS':
      addGlobalCSS(prediction.key, prediction.value);
      break;
    default:
      utils.logInfo(
        `Unsupported action for prediction with key: ${prediction.key}. Skipping its global change.`
      );
  }
}

function makeVisualChange(prediction: Prediction): void {
  if (!prediction.config) {
    utils.logInfo(
      `No config found for prediction with key: ${prediction.key}. Skipping its visual change.`
    );
    return;
  }
  const selector = prediction.config.selector;
  if (!selector) {
    utils.logInfo(
      `No selector found for prediction with key: ${prediction.key}. Skipping its visual change.`
    );
    return;
  }

  const element = utils.safeQuerySelector(selector);

  if (!element || !(element instanceof HTMLElement)) {
    utils.logInfo(
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
        utils.logInfo(
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
        utils.logInfo(
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
        utils.logInfo(
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
    case 'setFontSize':
      setElementStyle(element, `font-size: ${prediction.value}`);
      break;
    case 'setFontColor':
      setElementStyle(element, `color: ${prediction.value}`);
      break;
    case 'setBackgroundColor':
      setElementStyle(element, `background-color: ${prediction.value}`);
      break;
    case 'setVisibility':
      // eslint-disable-next-line no-case-declarations
      const val = prediction.value.toLowerCase();
      if (val === 'hide') {
        hideElement(element);
        break;
      } else if (val === 'show') {
        showElement(element);
        break;
      }
      utils.logInfo(
        "unsupported value for 'setVisibility' action",
        prediction.value
      );
      break;
    case 'setOuterHTML':
      setElementOuterHTML(element, prediction.value);
      break;
    default:
      utils.logInfo(
        `Unsupported action for prediction with key: ${prediction.key}. Skipping its visual change.`
      );
  }
}

function makeVisualChanges(): void {
  if (window.ezbot?.disabled) {
    console.warn('Ezbot SDK is disabled due to payment/subscription issue');
    return;
  }
  const predictions = window.ezbot?.predictions;
  if (!predictions) {
    utils.logInfo('No predictions found. Skipping visual changes.');
    return;
  }
  predictions.forEach((prediction) => {
    if (prediction.type != 'visual') {
      return;
    }

    const validationError = validateVisualPrediction(prediction);
    if (validationError != null) {
      utils.logInfo(validationError);
      return;
    }
    if (
      prediction.config &&
      globalVisualChanges.includes(prediction.config.action)
    ) {
      makeGlobalVisualChange(prediction);
      return;
    }
    makeVisualChange(prediction);
  });
}

const visualUtils = {
  validateVisualPrediction,
  parseCommaSeparatedList,
};

const visualChanges = {
  setElementText,
  setElementInnerHTML,
  setElementAttribute,
  addGlobalCSS,
  setElementHref,
  setElementSrc,
  addClassesToElement,
  removeClassesFromElement,
  setElementStyle,
  hideElement,
  showElement,
  makeVisualChange,
  makeVisualChanges,
  makeGlobalVisualChange,
};

// ezbot.ai has been shut down: every exported function is a guarded no-op.
// The original implementations above are preserved for reference.
const noop = () => undefined;
const gSetElementText = guard('setElementText', setElementText, noop);
const gSetElementInnerHTML = guard(
  'setElementInnerHTML',
  setElementInnerHTML,
  noop
);
const gSetElementAttribute = guard(
  'setElementAttribute',
  setElementAttribute,
  noop
);
const gAddGlobalCSS = guard('addGlobalCSS', addGlobalCSS, noop);
const gSetElementHref = guard('setElementHref', setElementHref, noop);
const gSetElementSrc = guard('setElementSrc', setElementSrc, noop);
const gAddClassesToElement = guard(
  'addClassesToElement',
  addClassesToElement,
  noop
);
const gRemoveClassesFromElement = guard(
  'removeClassesFromElement',
  removeClassesFromElement,
  noop
);
const gSetElementStyle = guard('setElementStyle', setElementStyle, noop);
const gHideElement = guard('hideElement', hideElement, noop);
const gShowElement = guard('showElement', showElement, noop);
const gValidateVisualPrediction = guard(
  'validateVisualPrediction',
  validateVisualPrediction,
  () => null
);
const gMakeVisualChange = guard('makeVisualChange', makeVisualChange, noop);
const gMakeVisualChanges = guard('makeVisualChanges', makeVisualChanges, noop);
const gParseCommaSeparatedList = guard(
  'parseCommaSeparatedList',
  parseCommaSeparatedList,
  () => [] as string[]
);
const gMakeGlobalVisualChange = guard(
  'makeGlobalVisualChange',
  makeGlobalVisualChange,
  noop
);

const guardedVisualUtils: typeof visualUtils = {
  validateVisualPrediction: gValidateVisualPrediction,
  parseCommaSeparatedList: gParseCommaSeparatedList,
};

const guardedVisualChanges: typeof visualChanges = {
  setElementText: gSetElementText,
  setElementInnerHTML: gSetElementInnerHTML,
  setElementAttribute: gSetElementAttribute,
  addGlobalCSS: gAddGlobalCSS,
  setElementHref: gSetElementHref,
  setElementSrc: gSetElementSrc,
  addClassesToElement: gAddClassesToElement,
  removeClassesFromElement: gRemoveClassesFromElement,
  setElementStyle: gSetElementStyle,
  hideElement: gHideElement,
  showElement: gShowElement,
  makeVisualChange: gMakeVisualChange,
  makeVisualChanges: gMakeVisualChanges,
  makeGlobalVisualChange: gMakeGlobalVisualChange,
};

export {
  guardedVisualUtils as visualUtils,
  guardedVisualChanges as visualChanges,
  gSetElementText as setElementText,
  gSetElementInnerHTML as setElementInnerHTML,
  gSetElementAttribute as setElementAttribute,
  gAddGlobalCSS as addGlobalCSS,
  gSetElementHref as setElementHref,
  gSetElementSrc as setElementSrc,
  gAddClassesToElement as addClassesToElement,
  gRemoveClassesFromElement as removeClassesFromElement,
  gSetElementStyle as setElementStyle,
  gHideElement as hideElement,
  gShowElement as showElement,
  gValidateVisualPrediction as validateVisualPrediction,
  gMakeVisualChange as makeVisualChange,
  gMakeVisualChanges as makeVisualChanges,
  gParseCommaSeparatedList as parseCommaSeparatedList,
  gMakeGlobalVisualChange as makeGlobalVisualChange,
};
