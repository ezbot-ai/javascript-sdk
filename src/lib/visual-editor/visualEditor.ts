/* eslint-disable functional/no-return-void */
import { v4 as uuidv4 } from 'uuid';

import { setLocalStyles } from './localStyles';

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

function setupUniqueElementIds(): void {
  const elements = document.querySelectorAll('*');
  elements.forEach((element) => {
    const elementId = uuidv4();
    element.setAttribute('data-ezbot-element-id', elementId);
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
