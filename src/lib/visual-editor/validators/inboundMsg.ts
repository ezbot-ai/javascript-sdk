/* eslint-disable functional/no-throw-statements */
import { logError } from '../../utils';

const inboundMsg = (msg: Readonly<MessageEvent>): boolean => {
  try {
    const data = JSON.parse(msg.data);
    if (!data.type) {
      throw new Error('Event type not found on incoming event');
    }
    return true;
  } catch (error) {
    logError(error as Error);
    return false;
  }
};

export { inboundMsg };
