/* eslint-disable functional/no-return-void */
import { postEventToParent } from './messaging';
import {
  setLocalStyles,
  setupElementClickListeners,
  setupReceiveMessageListener,
  setupUniqueElementIds,
} from './visualEditor';

type Mode = 'ezbot' | 'interactive';
type InitalizationEvent = {
  type: 'initialized';
  mode: Mode;
};

function buildInitalizationPayload(): InitalizationEvent {
  const mode = sessionStorage.getItem('ezbotVisualEditorMode');
  const eventPayload: InitalizationEvent = {
    type: 'initialized',
    mode: mode as Mode,
  };
  return eventPayload;
}

function sendInitEvent(): void {
  const initEvent = buildInitalizationPayload();
  console.log('initEvent', initEvent);
  postEventToParent(initEvent);
}

function initVisualEditor(): void {
  setupUniqueElementIds();
  setupElementClickListeners();
  setupReceiveMessageListener();
  setLocalStyles();
  sendInitEvent();
}

export { buildInitalizationPayload, sendInitEvent, initVisualEditor };
