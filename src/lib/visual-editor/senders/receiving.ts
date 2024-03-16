import { SDKReceivingEvent } from '../types';

import { postEventToParent } from './messaging';

// Tell Admin UI the SDK is ready to receive events, including an init event
function buildReceivingEvent(): SDKReceivingEvent {
  const initEventPayload: SDKReceivingEvent = {
    sender: 'ezbotSDK',
    type: 'SDKReceiving',
  };

  return initEventPayload;
}

// eslint-disable-next-line functional/no-return-void
function sendReceivingEvent() {
  const event = buildReceivingEvent();
  postEventToParent(event);
}

export { buildReceivingEvent, sendReceivingEvent };
