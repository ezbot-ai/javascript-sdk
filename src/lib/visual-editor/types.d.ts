type Mode = 'ezbot' | 'interactive';

// Inbound events
type InitEvent = {
  type: 'init';
  mode: Mode;
};

type SDKConfig = {
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

type ElementClickedPayload = {
  type: 'elementClicked';
  element: ElementPayload;
};

type OutboundEvent = ElementClickedPayload | InitEventPayload;

type SDKStatus = 'loading' | 'ready' | 'error';

type InitPayload = {
  status: SDKStatus;
};

type InitEventPayload = {
  type: 'init';
  payload: InitPayload;
};

export {
  LocalStyles,
  Mode,
  InitEvent,
  ChangeConfigEvent,
  ChangeVariablesEvent,
  SDKConfig,
  IncomingEvent,
  ElementClickedPayload,
  ElementPayload,
  OutboundEvent,
  ElementAttribute,
  ElementClientLocation,
  ElementStyleSetByAttribute,
  SDKStatus,
  InitPayload,
  InitEventPayload,
};
