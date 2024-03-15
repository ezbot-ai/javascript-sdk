import { logError } from '../../utils';

const inboundMsg = (msg: Readonly<MessageEvent>): boolean => {
  try {
    const data = JSON.parse(msg.data);
    // TODO: consider better validation
    if (!data.type) {
      return false;
    }
    return true;
  } catch (error) {
    logError(error as Error);
    return false;
  }
};

export { inboundMsg };
