/* eslint-disable functional/no-return-void */
import { v4 as uuidv4 } from 'uuid';

import { getSelector } from './getSelector';
import { highlightElement } from './highlighting';
import { setLocalStyles } from './localStyles';

// TODO: MOVE ME AND USE ME IN VISUAL EDITOR
// type HighlightElementPayload = {
//   ezbotElementId: string;
//   tag: string;
//   selector: string;
//   color: string;
// };

// TODO: make types explicit and export
function setupReceiveMessageListener(): void {
  window.addEventListener(
    'message',
    (msg: Readonly<MessageEvent>) => {
      console.log(msg);
      const { data } = msg;
      const { ezbotElement, type } = JSON.parse(data);
      console.log('ezbotElement', ezbotElement);
      const element = document.querySelector(ezbotElement.selector);
      if (!element) {
        console.error('Element with selector not found', ezbotElement.selector);
        return;
      }
      if (type == 'highlightElement') {
        highlightElement(element);
      } else {
        console.error('Unknown message type', type);
      }
    },
    false
  );
}

type VisualEditorElementPayload = {
  text: string;
  id: string;
  classes: DOMTokenList;
  tag: string;
  href: string | null;
  selector: string;
  ezbotElementId: string | null;
};

type VisualEditorClickEventPayload = {
  event: string;
  element: VisualEditorElementPayload;
};

function buildElementClickPayload(element: Readonly<HTMLElement>): string {
  const elementText = element.innerText;
  const elementId = element.id;
  const elementClasses = element.classList;
  const elementTag = element.tagName;
  const elementHref = element.getAttribute('href');
  const querySelector = getSelector(element);
  const ezbotElementId = element.getAttribute('data-ezbot-element-id');
  const elementPayload = {
    text: elementText,
    id: elementId,
    classes: elementClasses,
    tag: elementTag,
    href: elementHref,
    selector: querySelector,
    ezbotElementId,
  };
  const eventPayload = {
    event: 'elementClicked',
    element: elementPayload,
  };
  return JSON.stringify(eventPayload);
}

function postMessageToParent(message: object): void {
  window.parent.postMessage(message, '*');
}

function setupUniqueElementIds(): void {
  const elements = document.querySelectorAll('*');
  elements.forEach((element) => {
    const elementId = uuidv4();
    element.setAttribute('data-ezbot-element-id', elementId);
  });
}

function setupElementClickListeners(): void {
  document.addEventListener('click', (event) => {
    const element = event.target as HTMLElement;
    const elementPayloadJSONString = buildElementClickPayload(element);
    const elementPayload = JSON.parse(elementPayloadJSONString);
    const elementPayloadWithArrayClasses = {
      ...elementPayload,
      classes: Array.from(elementPayload.element.classes),
    };
    postMessageToParent(elementPayloadWithArrayClasses); // TODO: ADD DOMAIN LEVEL RESTRICTIONS
  });
}
export {
  VisualEditorElementPayload,
  VisualEditorClickEventPayload,
  setupElementClickListeners,
  setupUniqueElementIds,
  setLocalStyles,
  setupReceiveMessageListener,
};
