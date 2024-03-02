import { IncomingEvent } from '../msg-router';

const parseIncomingMsg = (msg: Readonly<MessageEvent>): IncomingEvent => {
  const { data } = msg;
  const incomingEvent = JSON.parse(data) as IncomingEvent;
  return incomingEvent;
};

export { parseIncomingMsg };
