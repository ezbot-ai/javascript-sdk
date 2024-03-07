/* eslint-disable functional/no-return-void */
import * as Snowplow from '@snowplow/browser-tracker';
import {
  ActivityTrackingConfiguration,
  PageViewEvent,
} from '@snowplow/browser-tracker-core';

import {
  ezbotLinkClickEventSchemaPath,
  ezbotRewardEventSchemaPath,
  ezbotTrackerId,
} from './constants';
import {
  EzbotLinkClickEvent,
  EzbotLinkClickEventPayload,
  EzbotRewardEvent,
  EzbotRewardEventPayload,
} from './types';

function trackRewardEvent(payload: Readonly<EzbotRewardEventPayload>): void {
  const event: EzbotRewardEvent = {
    schema: ezbotRewardEventSchemaPath,
    data: payload,
  };
  Snowplow.trackSelfDescribingEvent(
    { event: event },
    [ezbotTrackerId] // only send to ezbot tracker
  );
}

function trackLinkClick(payload: Readonly<EzbotLinkClickEventPayload>): void {
  const event: EzbotLinkClickEvent = {
    schema: ezbotLinkClickEventSchemaPath,
    data: payload,
  };
  Snowplow.trackSelfDescribingEvent(
    {
      event: event,
    },
    [ezbotTrackerId] // only send to ezbot tracker
  );
}

const defaultActivityTrackingConfiguration: ActivityTrackingConfiguration = {
  minimumVisitLength: 2,
  heartbeatDelay: 2,
};

function startActivityTracking(
  config: ActivityTrackingConfiguration = defaultActivityTrackingConfiguration
): void {
  Snowplow.enableActivityTracking(config, [ezbotTrackerId]); // only send to ezbot tracker
}

function trackPageView(
  config?: Readonly<PageViewEvent & Snowplow.CommonEventProperties>
): void {
  Snowplow.trackPageView(config);
}

export {
  trackRewardEvent,
  trackLinkClick,
  startActivityTracking,
  trackPageView,
};
