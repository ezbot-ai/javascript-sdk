import { Mode } from '../types';

type InitEvent = {
  type: 'init';
  mode: Mode;
};

type SDKConfig = {
  mode: Mode;
  highlightColor: string;
};

type ChangeConfigEvent = {
  type: 'changeConfig';
  mode: Mode;
  config: SDKConfig;
};
type ChangeVariablesEvent = {
  type: 'changeVariables';
  variables: unknown; // TODO: specify variables type
};

type IncomingEvent = InitEvent | ChangeConfigEvent | ChangeVariablesEvent;

export {
  IncomingEvent,
  InitEvent,
  ChangeConfigEvent,
  ChangeVariablesEvent,
  SDKConfig,
};
