import { logInfo } from '../../utils';
import * as actions from '../actions';
import { IncomingEvent } from '../types';
import { documentIsParent } from '../utils';
import * as validators from '../validators';

const routeIncomingEvent = (
  event: Readonly<IncomingEvent>
): boolean | Error => {
  if (!validators.inboundEvent(event)) {
    return false;
  }
  if (documentIsParent()) {
    logInfo(
      `Will not process event because ezbot installed in the same window as the visual editor.`
    );
    return false;
  }
  switch (event.type) {
    case 'init':
      actions.initVisualEditorSupport(event.mode, event.config);
      return true;
    case 'changeConfig':
      actions.changeConfig(event.mode, event.config, event.variables);
      return true;
    case 'changeVariables':
      actions.changeVariables(event.payload);
      return true;
    default:
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Invalid event type');
  }
};

export { routeIncomingEvent };
