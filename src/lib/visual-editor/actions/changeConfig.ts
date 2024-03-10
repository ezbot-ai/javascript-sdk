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
  mutators.persistMode(mode);
  mutators.persistVisualVariables(variables);
  mutators.persistConfig(config);
  const visualVariables = window.ezbot.visualVariables;

  if (mode == 'ezbot') {
    const styles = buildLocalStyles(config);
    mutators.setLocalStyles(styles);
    mutators.setupClickListeners();
    mutators.setupUniqueElementIds();
    mutators.unhighlightAllElements();
    mutators.markElementVariables(visualVariables);
    mutators.highlightElementsWithVariables(visualVariables);
    mutators.startVariableShuffle(visualVariables);
  } else {
    mutators.stopVariableShuffle();
    mutators.removeLocalStyles();
  }
};

export { changeConfig };
