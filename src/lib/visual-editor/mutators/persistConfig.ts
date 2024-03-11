/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
import { SDKConfig } from '../types';

const persistConfig = (config: Readonly<SDKConfig>) => {
  window.ezbot.config = config;
};

export { persistConfig };
