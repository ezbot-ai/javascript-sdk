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
type ElementPayload = {
  text: string;
  id: string;
  classes: string[];
  tag: string;
  href: string | null;
  selector: string;
  innerHTML: string;
};

type ElementClickedPayload = {
  type: 'elementClicked';
  element: ElementPayload;
};

type OutboundEvent = ElementClickedPayload;

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
};
