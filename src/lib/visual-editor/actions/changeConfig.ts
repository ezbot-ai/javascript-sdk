/* eslint-disable functional/no-return-void */
import * as mutators from '../mutators';
import { buildLocalStyles } from '../mutators/localStyles';
import { DBVariable, SDKConfig } from '../types';
import { Mode } from '../types';

const changeConfig = (
  mode: Mode,
  config: Readonly<SDKConfig>,
  variables?: readonly DBVariable[]
) => {
  mutators.persistMode(mode);
  if (variables) {
    mutators.persistVisualVariables(variables);
  }

  mutators.persistConfig(config);
  const visualVariables = window.ezbot.visualVariables;
  mutators.stopVariableShuffle();

  if (mode == 'ezbot') {
    const styles = buildLocalStyles(config);
    mutators.setLocalStyles(styles);
    mutators.setupClickListeners();
    mutators.startVariableShuffle(visualVariables);
  } else {
    mutators.removeLocalStyles();
  }

  if (config.highlightEnabled) {
    mutators.highlightElementsWithVariables(visualVariables);
  } else {
    mutators.unhighlightAllElementsWithVariables();
  }
};

export { changeConfig };
