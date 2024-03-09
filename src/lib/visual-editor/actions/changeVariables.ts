/* eslint-disable functional/no-return-void */
import { logInfo } from '../../utils';
import * as mutators from '../mutators';
import { DBVariable } from '../types';

const changeVariables = (variables: readonly DBVariable[]) => {
  const visualVariables = variables.filter(
    (variable) => variable.type === 'visual'
  );
  // eslint-disable-next-line functional/immutable-data
  window.ezbot.visualVariables = visualVariables;
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
      mutators.startVariableShuffle();
      mutators.markElementVariable(element as HTMLElement, variable);
      mutators.highlightElementWithVariable(element as HTMLElement);
    } catch (error) {
      logInfo('Error highlighting element', error);
    }
  });
};

export { changeVariables };
