type Mode = 'ezbot' | 'interactive';

// Inbound events
type InitEvent = {
  type: 'init';
  mode: Mode;
  config: SDKConfig;
};

type SDKConfig = {
  highlightColor: string;
  highlightEnabled: boolean;
};

type ChangeConfigEvent = {
  type: 'changeConfig';
  mode: Mode;
  config: SDKConfig;
  variables?: DBVariable[];
};

type SetAttributeConfig = {
  selector: string;
  action: 'setAttribute';
  attribute: string;
};
type BaseVisualVariableConfig = {
  selector: string;
  attribute?: string;
  action:
    | 'setText'
    | 'setInnerHTML'
    | 'setHref'
    | 'setSrc'
    | 'hide'
    | 'show'
    | 'addClasses'
    | 'removeClasses'
    | 'setStyle'
    | 'setAttribute'
    | 'setFontSize'
    | 'setFontColor'
    | 'setBackgroundColor'
    | 'setVisibility'
    | 'setOuterHTML';
};

type VariableConstraints = {
  enumerables: Array<string>;
};

type VisualVariableConfig = BaseVisualVariableConfig | SetAttributeConfig;
type DBVariable = {
  id: number;
  key: string;
  type: 'basic' | 'visual';
  version: string;
  projectId: number;
  humanReadableName: string;
  defaultValue: string;
  createdBy: number;
  config: VisualVariableConfig | null;
  constraints: VariableConstraints;
  constraintsVersion: string;
  createdAt: Date;
  updatedAt: Date;
};
type ChangeVariablesEvent = {
  type: 'changeVariables';
  payload: DBVariable[];
};

type IncomingEvent = InitEvent | ChangeConfigEvent | ChangeVariablesEvent;

// Mutator Types
type LocalStyles = {
  [selector: string]: {
    [property: string]: string;
  };
};

// Outbound Types
type ElementStyleSetByAttribute = {
  attribute: string;
  value: string;
};

type ElementClientLocation = {
  clientHeight: number;
  clientWidth: number;
  clientTop: number;
  clientLeft: number;
};

type ElementAttribute = {
  name: string;
  value: string | Array<string>;
};

type ElementPayload = {
  ezbotTempId: string | null;
  text: string;
  attributes: ElementAttribute[];
  tag: string;
  selector: string;
  innerHTML: string;
  outerHTML: string;
  visible: boolean;
  style: ElementStyleSetByAttribute[];
  clientLocation: ElementClientLocation;
};

type ElementClickedEvent = {
  type: 'elementClicked';
  element: ElementPayload;
};

type OutboundEvent =
  | ElementClickedEvent
  | SDKStatusChangeEvent
  | SDKReceivingEvent;

type SDKStatus = 'loading' | 'ready' | 'error';

type SDKStatusChangePayload = {
  status: SDKStatus;
};

type SDKStatusChangeEvent = {
  type: 'SDKStatusChange';
  payload: SDKStatusChangePayload;
};

type SDKReceivingEvent = {
  type: 'SDKReceiving';
};

export {
  LocalStyles,
  Mode,
  InitEvent,
  ChangeConfigEvent,
  SDKConfig,
  IncomingEvent,
  ElementClickedEvent,
  ElementPayload,
  OutboundEvent,
  ElementAttribute,
  ElementClientLocation,
  ElementStyleSetByAttribute,
  SDKStatus,
  SDKStatusChangePayload,
  SDKStatusChangeEvent,
  DBVariable,
  VisualVariableConfig,
  ChangeVariablesEvent,
  SetAttributeConfig,
  BaseVisualVariableConfig,
  VariableConstraints,
  SDKReceivingEvent,
};
