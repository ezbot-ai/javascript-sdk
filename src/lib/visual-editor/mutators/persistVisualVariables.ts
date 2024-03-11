/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
import { DBVariable } from '../types';

const persistVisualVariables = (variables: readonly DBVariable[]) => {
  const visualVariables = variables.filter(
    (variable) => variable.type === 'visual'
  );

  window.ezbot.visualVariables = visualVariables;
};

export { persistVisualVariables };
