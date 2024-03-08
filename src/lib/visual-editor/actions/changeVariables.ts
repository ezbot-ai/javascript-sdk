/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import { highlightElement } from '../mutators';
import { DBVariable } from '../types';

const changeVariables = (variables: readonly DBVariable[]) => {
  const visualVariables = variables.filter(
    (variable) => variable.type === 'visual'
  );
  visualVariables.map((variable): void => {
    try {
      if (!variable.config) {
        logInfo('No config found for visual variable');
        return;
      }
      const element = document.querySelector(variable.config.selector);
      if (!element) {
        logInfo('No element found for visual variable');
        return;
      }
      highlightElement(element as HTMLElement);
    } catch (error) {
      logInfo('Error highlighting element', error);
    }
  });
};

export { changeVariables };
