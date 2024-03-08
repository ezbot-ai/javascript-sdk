import { SDKStatus, SDKStatusChangeEvent } from '../types';

import { postEventToParent } from './messaging';

function buildSDKStatusChangeEvent(status: SDKStatus): SDKStatusChangeEvent {
  const initEventPayload: SDKStatusChangeEvent = {
    type: 'SDKStatusChange',
    payload: {
      status,
    },
  };

  return initEventPayload;
}

// eslint-disable-next-line functional/no-return-void
function sendInit(status: SDKStatus) {
  const payload = buildSDKStatusChangeEvent(status);
  postEventToParent(payload);
}

export { buildSDKStatusChangeEvent, sendInit };
