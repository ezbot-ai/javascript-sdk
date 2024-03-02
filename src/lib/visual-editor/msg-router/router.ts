/* eslint-disable functional/no-throw-statements */
import { logInfo } from '../../utils';
import * as actions from '../actions';
import { IncomingEvent } from '../types';
import * as validators from '../validators';

const routeIncomingEvent = (
  event: Readonly<IncomingEvent>
): boolean | Error => {
  if (!validators.inboundEvent(event)) {
    logInfo(`Invalid event: ${event}`);
    return false;
  }
  switch (event.type) {
    case 'init':
      actions.init(event.mode);
      break;
    case 'changeConfig':
      actions.changeConfig(event.mode, event.config);
      return true;
    case 'changeVariables':
      throw new Error('Cannot route changeVariables: Not yet implemented');
    default:
      throw new Error('Invalid event type');
  }
  throw new Error('Not implemented');
};

export { routeIncomingEvent };
