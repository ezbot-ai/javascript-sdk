/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import { DBVariable } from '../types';
import * as utils from '../utils';

const markElementVariable = (
  element: Readonly<HTMLElement>,
  variable: Readonly<DBVariable>
) => {
  if (!variable.config) {
    logInfo('Cannot mark element without variable config');
    return;
  }
  element.setAttribute(
    'data-ezbot-variable-selector',
    variable.config.selector
  );
};

const markElementVariables = (visualVariables: readonly DBVariable[]): void => {
  visualVariables.map((variable): void => {
    try {
      if (!variable.config) {
        logInfo('No config found for visual variable');
        return;
      }
      const element = utils.safeQuerySelector(variable.config.selector);

      // ignore unless element is found
      if (!element) {
        return;
      }

      markElementVariable(element as HTMLElement, variable);
    } catch (error) {
      logInfo('Error marking element', error);
    }
  });
};

export { markElementVariable, markElementVariables };
