/* eslint-disable functional/no-return-void */
import { Mode } from '../types';
import { getSelector } from '../utils';

import { postEventToParent } from './messaging';
import { ElementClickedPayload } from './outbound-types';

function buildElementClickedPayload(
  element: Readonly<HTMLElement>
): ElementClickedPayload {
  const elementText = element.innerText;
  const elementId = element.id;
  const elementClasses = element.classList;
  const clonableElementClasses = Array.from(elementClasses);
  const elementTag = element.tagName;
  const elementHref = element.getAttribute('href');
  const querySelector = getSelector(element);
  const ezbotElementId = element.getAttribute('data-ezbot-element-id');
  const elementPayload = {
    text: elementText,
    id: elementId,
    classes: clonableElementClasses,
    tag: elementTag,
    href: elementHref,
    selector: querySelector,
    ezbotElementId,
  };
  const modeItem = sessionStorage.getItem('ezbotVisualEditorMode');
  const mode = modeItem ? (modeItem as Mode) : 'interactive';
  const eventPayload: ElementClickedPayload = {
    type: 'elementClicked',
    mode: mode,
    element: elementPayload,
  };
  return eventPayload;
}

const sendElementClickedMsg = (element: Readonly<HTMLElement>) => {
  const elementClickedPayload = buildElementClickedPayload(element);
  postEventToParent(elementClickedPayload);
};

export { buildElementClickedPayload, sendElementClickedMsg };
