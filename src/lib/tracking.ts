/* eslint-disable functional/prefer-immutable-types */
/* eslint-disable functional/no-return-void */
import {
  CommonEventProperties,
  enableActivityTracking,
  trackPageView as tPageView,
  trackSelfDescribingEvent,
} from '@snowplow/browser-tracker';
import {
  ActivityTrackingConfiguration,
  PageViewEvent,
} from '@snowplow/browser-tracker-core';

import {
  ezbotLinkClickEventSchema,
  ezbotRewardEventSchema,
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
    schema: ezbotRewardEventSchema,
    data: payload,
  };
  trackSelfDescribingEvent(
    { event: event },
    [ezbotTrackerId] // only send to ezbot tracker
  );
}

function trackLinkClick(payload: Readonly<EzbotLinkClickEventPayload>): void {
  const event: EzbotLinkClickEvent = {
    schema: ezbotLinkClickEventSchema,
    data: payload,
  };
  trackSelfDescribingEvent(
    {
      event: event,
    },
    [ezbotTrackerId] // only send to ezbot tracker
  );
}

function startActivityTracking(config: ActivityTrackingConfiguration): void {
  enableActivityTracking(config, [ezbotTrackerId]); // only send to ezbot tracker
}

function trackPageView(
  config: Readonly<PageViewEvent & CommonEventProperties>
): void {
  tPageView(config);
}

export {
  trackRewardEvent,
  trackLinkClick,
  startActivityTracking,
  trackPageView,
};
