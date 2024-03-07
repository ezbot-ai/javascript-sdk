// import and export everything from the nearby directories
import * as actions from './actions';
import * as msgRouter from './msg-router';
import * as mutators from './mutators';
import * as senders from './senders';
import {
  ChangeConfigEvent,
  ChangeVariablesEvent,
  ElementClickedPayload,
  ElementPayload,
  IncomingEvent,
  InitEvent,
  Mode,
  OutboundEvent,
  SDKConfig,
} from './types.d';
import * as utils from './utils';
import * as validators from './validators';

const VisualEditorController = {
  actions,
  msgRouter,
  mutators,
  senders,
  utils,
  validators,
};
export {
  VisualEditorController,
  InitEvent,
  SDKConfig,
  ChangeConfigEvent,
  ChangeVariablesEvent,
  OutboundEvent,
  IncomingEvent,
  ElementClickedPayload,
  ElementPayload,
  Mode,
};
