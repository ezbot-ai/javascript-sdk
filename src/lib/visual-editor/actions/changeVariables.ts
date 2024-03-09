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
      // eslint-disable-next-line functional/no-let
      let element: HTMLElement | null;
      try {
        element = document.querySelector(variable.config.selector);
      } catch (e) {
        element = null;
      }

      // ignore unless element is found
      if (!element) {
        return;
      }

      mutators.startVariableShuffle(visualVariables);
      mutators.markElementVariable(element as HTMLElement, variable);
      mutators.highlightElementWithVariable(element as HTMLElement);
    } catch (error) {
      logInfo('Error highlighting element', error);
    }
  });
};

export { changeVariables };
