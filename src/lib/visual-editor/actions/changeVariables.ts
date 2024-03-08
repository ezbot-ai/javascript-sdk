/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import * as mutators from '../mutators';
import { DBVariable } from '../types';

const changeVariables = (variables: readonly DBVariable[]) => {
  const visualVariables = variables.filter(
    (variable) => variable.type === 'visual'
  );
  visualVariables.map((variable): void => {
    try {
      mutators.highlightVariable(variable);
      mutators.setupTooltipListeners(variable);
    } catch (error) {
      logInfo('Error highlighting element', error);
    }
  });
};

export { changeVariables };
