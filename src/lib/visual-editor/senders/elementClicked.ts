import { Mode } from '../types';
import { ElementClickedPayload } from '../types';
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
  const modeItem = sessionStorage.getItem('ezbotVisualEditorMode'); // TODO: Remove?
  const mode = modeItem ? (modeItem as Mode) : 'interactive';
  const eventPayload: ElementClickedPayload = {
    type: 'elementClicked',
    mode: mode,
    element: elementPayload,
  };
  return eventPayload;
}

export { buildElementClickedPayload };
