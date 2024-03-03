import { ElementClickedPayload, ElementPayload } from '../types';
import { getSelector } from '../utils';

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
  const elementPayload: ElementPayload = {
    text: elementText,
    id: elementId,
    classes: clonableElementClasses,
    tag: elementTag,
    href: elementHref,
    selector: querySelector,
    innerHTML: element.innerHTML,
  };
  const eventPayload: ElementClickedPayload = {
    type: 'elementClicked',
    element: elementPayload,
  };
  return eventPayload;
}

export { buildElementClickedPayload };
