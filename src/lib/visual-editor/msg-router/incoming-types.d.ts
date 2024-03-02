import { Mode } from '../types';

type InitEvent = {
  type: 'init';
  mode: Mode;
};

type ChangeConfigEvent = {
  type: 'changeConfig';
  config: unknown; // TODO: specify config type
};
type ChangeModeEvent = {
  type: 'changeMode';
  mode: Mode;
};
type ChangeVariablesEvent = {
  type: 'changeVariables';
  variables: unknown; // TODO: specify variables type
};

type IncomingEvent =
  | InitEvent
  | ChangeConfigEvent
  | ChangeModeEvent
  | ChangeVariablesEvent;

export {
  IncomingEvent,
  InitEvent,
  ChangeConfigEvent,
  ChangeModeEvent,
  ChangeVariablesEvent,
};
