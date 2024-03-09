/* eslint-disable functional/no-throw-statements */
import { logInfo } from '../../utils';
import * as actions from '../actions';
import { IncomingEvent } from '../types';
import * as validators from '../validators';

const routeIncomingEvent = (
  event: Readonly<IncomingEvent>
): boolean | Error => {
  if (!validators.inboundEvent(event)) {
    logInfo(`Received invalid event`, event);
    return false;
  }
  switch (event.type) {
    case 'init':
      actions.initVisualEditorSupport(event.mode);
      return true;
    case 'changeConfig':
      actions.changeConfig(event.mode, event.config, event.variables);
      return true;
    case 'changeVariables':
      actions.changeVariables(event.payload);
      return true;
    default:
      throw new Error('Invalid event type');
  }
};

export { routeIncomingEvent };
