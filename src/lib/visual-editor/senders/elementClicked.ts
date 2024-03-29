import {
  ElementAttribute,
  ElementClickedEvent,
  ElementClientLocation,
  ElementPayload,
  ElementStyleSetByAttribute,
} from '../types';
import { getSelector } from '../utils';

import { postEventToParent } from './messaging';

const buildElementStyle = (
  element: Readonly<HTMLElement>
): ElementStyleSetByAttribute[] => {
  const styleAttr = element.style;
  // remove all keys and values where the value is empty string
  const styleEntries = Object.entries(styleAttr).filter(
    ([, value]) => value !== ''
  );
  // remove all keys and values where the key is a numeric string
  const styleEntriesFiltered = styleEntries.filter(([key]) =>
    isNaN(parseInt(key))
  );
  // build the array of style objects from [[attribute, value], ...]
  const transformed = styleEntriesFiltered.map((val) => ({
    attribute: val[0],
    value: val[1],
  }));
  return transformed;
};

const buildElementClientLocation = (
  element: Readonly<HTMLElement>
): ElementClientLocation => ({
  clientHeight: element.clientHeight,
  clientWidth: element.clientWidth,
  clientTop: element.clientTop,
  clientLeft: element.clientLeft,
});

function buildElementAttributes(
  element: Readonly<HTMLElement>
): ElementAttribute[] {
  return Array.from(element.attributes).map((attribute) => {
    if (attribute.name === 'class') {
      return {
        name: attribute.name,
        value: Array.from(element.classList),
      };
    } else {
      return {
        name: attribute.name,
        value: attribute.value,
      };
    }
  });
}

const buildElementSelector = (element: Readonly<HTMLElement>): string => {
  const elementVariableSelector = element.getAttribute(
    'data-ezbot-variable-selector'
  );

  if (elementVariableSelector) {
    return elementVariableSelector;
  }

  return getSelector(element);
};

function buildElementClickedPayload(
  element: Readonly<HTMLElement>
): ElementClickedEvent {
  const elementText = element.innerText;
  const elementTag = element.tagName;

  const elementPayload: ElementPayload = {
    ezbotTempId: element.getAttribute('data-ezbot-temp-id'),
    text: elementText,
    attributes: buildElementAttributes(element),
    tag: elementTag,
    selector: buildElementSelector(element),
    innerHTML: element.innerHTML,
    outerHTML: element.outerHTML,
    clientLocation: buildElementClientLocation(element),
    visible: element.checkVisibility(),
    style: buildElementStyle(element),
  };
  const eventPayload: ElementClickedEvent = {
    sender: 'ezbotSDK',
    type: 'elementClicked',
    element: elementPayload,
  };
  return eventPayload;
}

// eslint-disable-next-line functional/no-return-void
function sendElementClicked(element: Readonly<HTMLElement>) {
  const payload = buildElementClickedPayload(element);
  postEventToParent(payload);
}

export { buildElementClickedPayload, sendElementClicked };
