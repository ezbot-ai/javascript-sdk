import { InitEventPayload, SDKStatus } from '../types';

import { postEventToParent } from './messaging';

function buildInitPayload(status: SDKStatus): InitEventPayload {
  const initEventPayload: InitEventPayload = {
    type: 'init',
    payload: {
      status,
    },
  };

  return initEventPayload;
}

// eslint-disable-next-line functional/no-return-void
function sendInit(status: SDKStatus) {
  const payload = buildInitPayload(status);
  postEventToParent(payload);
}

export { buildInitPayload, sendInit };
