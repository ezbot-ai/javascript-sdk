import { logError, logInfo } from '../../utils';
import { IncomingEvent } from '../types';

const inboundEvent = (event: Readonly<IncomingEvent>): boolean => {
  try {
    if (!event.type) {
      return false;
    }
    switch (event.type) {
      case 'init':
        if (!event.mode) {
          return false;
        }
        return true;
      case 'changeConfig':
        if (!event.mode || !event.config) {
          return false;
        }
        return true;
      case 'changeVariables':
        if (!event.variables) {
          return false;
        }
        return true;
      default:
        logInfo(`Invalid event with type: ${(event as IncomingEvent).type}`);
        return false;
    }
  } catch (error) {
    logError(error as Error);
    return false;
  }
};

export { inboundEvent };
