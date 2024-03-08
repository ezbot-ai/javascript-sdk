/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import { DBVariable } from '../types';

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

export { markElementVariable };
