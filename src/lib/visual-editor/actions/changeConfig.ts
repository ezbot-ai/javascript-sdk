/* eslint-disable functional/no-return-void */
import { SDKConfig } from '../msg-router/incoming-types';
import * as mutators from '../mutators';
import { buildLocalStyles } from '../mutators/localStyles';
import { Mode } from '../types';

const changeConfig = (mode: Mode, config: Readonly<SDKConfig>) => {
  if (mode == 'ezbot') {
    const styles = buildLocalStyles(config.highlightColor);
    mutators.setLocalStyles(styles);
  } else {
    mutators.removeLocalStyles();
  }
};

export { changeConfig };
