/* eslint-disable functional/no-return-void */
import { v4 as uuidv4 } from 'uuid';

import { getSelector } from './getSelector';
import { highlightElement } from './highlighting';
import { setLocalStyles } from './localStyles';
import { postEventToParent } from './messaging';
import { changeMode, Mode } from './mode';

// TODO: MOVE ME AND USE ME IN VISUAL EDITOR
// type HighlightElementPayload = {
//   ezbotElementId: string;
//   tag: string;
//   selector: string;
//   color: string;
// };

// TODO: make types explicit and export
// This function receives ALL messages from Admin UI and routes them to
// the appropriate handler
function setupReceiveMessageListener(): void {
  window.addEventListener(
    'message',
    (msg: Readonly<MessageEvent>) => {
      console.log(msg);
      const { data } = msg;
      const parsedMsg = JSON.parse(data);
      console.log('sdk received message: ', parsedMsg.type, data);
      if (parsedMsg.type == 'highlightElement') {
        const { ezbotElement } = JSON.parse(data);
        console.log('ezbotElement', ezbotElement);
        const element = document.querySelector(ezbotElement.selector);
        if (!element) {
          console.error(
            'Element with selector not found',
            ezbotElement.selector
          );
          return;
        }
        highlightElement(element);
      } else if (parsedMsg.type == 'changeMode') {
        console.log('calling ChangeMode');
        changeMode(parsedMsg.mode);
      }
    },
    false
  );
}

type VisualEditorElementPayload = {
  text: string;
  id: string;
  classes: string[];
  tag: string;
  href: string | null;
  selector: string;
  ezbotElementId: string | null;
};

type VisualEditorClickEventPayload = {
  event: string;
  mode: 'interactive' | 'ezbot';
  element: VisualEditorElementPayload;
};

function buildElementClickPayload(
  element: Readonly<HTMLElement>
): VisualEditorClickEventPayload {
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
  const eventPayload: VisualEditorClickEventPayload = {
    event: 'elementClicked',
    mode: mode,
    element: elementPayload,
  };
  return eventPayload;
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
    const elementPayload = buildElementClickPayload(element);
    const elementPayloadWithArrayClasses = {
      ...elementPayload,
      classes: Array.from(elementPayload.element.classes),
      type: 'elementClicked',
      mode: sessionStorage.getItem('ezbotVisualEditorMode'),
    };
    console.log(
      'elementPayloadWithArrayClasses',
      elementPayloadWithArrayClasses
    );
    postEventToParent(elementPayloadWithArrayClasses); // TODO: ADD DOMAIN LEVEL RESTRICTIONS
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
