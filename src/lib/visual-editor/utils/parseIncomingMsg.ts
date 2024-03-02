import { IncomingEvent } from '../types';

const parseIncomingMsg = (msg: Readonly<MessageEvent>): IncomingEvent => {
  const { data } = msg;
  const incomingEvent = JSON.parse(data) as IncomingEvent;
  return incomingEvent;
};

export { parseIncomingMsg };
