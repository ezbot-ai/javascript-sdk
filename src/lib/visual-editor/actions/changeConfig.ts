/* eslint-disable functional/no-return-void */
import * as mutators from '../mutators';
import { buildLocalStyles } from '../mutators/localStyles';
import { SDKConfig } from '../types';
import { Mode } from '../types';

const changeConfig = (mode: Mode, config: Readonly<SDKConfig>) => {
  if (mode == 'ezbot') {
    const styles = buildLocalStyles(config.highlightColor);
    mutators.setLocalStyles(styles);
    mutators.unhighlightAllElements();
  } else {
    mutators.stopVariableShuffle();
    mutators.removeLocalStyles();
  }
};

export { changeConfig };
