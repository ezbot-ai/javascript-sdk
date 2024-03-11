/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */

import { Mode } from '../types';

const persistMode = (mode: Mode) => {
  window.ezbot.mode = mode;
};

export { persistMode };
