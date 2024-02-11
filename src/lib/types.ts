/* eslint-disable functional/no-return-void */
/* eslint-disable functional/prefer-immutable-types */
import { CommonEventProperties } from '@snowplow/browser-tracker';
import {
  ActivityTrackingConfiguration,
  BrowserTracker,
  PageViewEvent,
} from '@snowplow/browser-tracker-core';

type VariableConfig = {
  selector: string;
  action: string;
};

type Prediction = {
  key: string;
  type: string;
  version: string;
  value: string;
  config: VariableConfig;
};

type Predictions = {
  predictions: Array<Prediction>;
};

type PredictionsResponse = {
  holdback: boolean;
  predictions: Array<Prediction>;
};

type EzbotRewardEvent = {
  schema: string;
  data: EzbotRewardEventPayload;
};

type EzbotRewardEventPayload = {
  key: string;
  reward?: number | null;
  rewardUnits?: string | null;
  category?: string | null;
};

type EzbotLinkClickEvent = {
  schema: string;
  data: EzbotLinkClickEventPayload;
};

type EzbotLinkClickEventPayload = {
  text?: string | null;
  href?: string | null;
  selector: string;
};

type Variation = {
  variable: string;
  value: string;
};

type EzbotPredictionsContext = {
  schema: string;
  data: {
    predictions: Array<Variation>;
  };
};

declare global {
  interface Window {
    ezbot: {
      tracker: BrowserTracker;
      predictions: Array<Prediction>;
      sessionId: string;
      trackPageView: (event?: PageViewEvent & CommonEventProperties) => void;
      trackRewardEvent: (payload: Readonly<EzbotRewardEventPayload>) => void;
      startActivityTracking: (config: ActivityTrackingConfiguration) => void;
      makeVisualChanges: () => void;
    };
  }
}

export {
  VariableConfig,
  Prediction,
  Predictions,
  PredictionsResponse,
  EzbotRewardEvent,
  EzbotRewardEventPayload,
  EzbotLinkClickEvent,
  EzbotLinkClickEventPayload,
  EzbotPredictionsContext,
};

declare global {
  interface Window {
    ezbot: {
      tracker: BrowserTracker;
      predictions: Array<Prediction>;
      sessionId: string;
      trackPageView: (event?: PageViewEvent & CommonEventProperties) => void;
      trackRewardEvent: (payload: Readonly<EzbotRewardEventPayload>) => void;
      startActivityTracking: (config: ActivityTrackingConfiguration) => void;
      makeVisualChanges: () => void;
    };
  }
}
