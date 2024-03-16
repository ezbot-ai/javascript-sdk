import { logError, logInfo } from '../../utils';

const inboundMsg = (msg: Readonly<MessageEvent>): boolean => {
  try {
    JSON.parse(msg.data);
    return true;
  } catch (error) {
    logError(error as Error);
    logInfo('error was with msg: ', msg);
    return false;
  }
};

export { inboundMsg };
