/* eslint-disable functional/no-return-void */
import * as mutators from '../mutators';
import { buildLocalStyles } from '../mutators/localStyles';
import { DBVariable, SDKConfig } from '../types';
import { Mode } from '../types';

const changeConfig = (
  mode: Mode,
  config: Readonly<SDKConfig>,
  variables: readonly DBVariable[]
) => {
  const visualVariables = variables.filter((v) => v.type === 'visual');
  if (mode == 'ezbot') {
    const styles = buildLocalStyles(config.highlightColor);
    mutators.setLocalStyles(styles);
    mutators.setupClickListeners();
    mutators.markElementVariables(visualVariables);
    mutators.highlightElementsWithVariables(visualVariables);
    mutators.startVariableShuffle(visualVariables);
  } else {
    mutators.stopVariableShuffle();
    mutators.removeLocalStyles();
  }
};

export { changeConfig };
