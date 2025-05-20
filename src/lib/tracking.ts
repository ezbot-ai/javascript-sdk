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

function removeSnowplowQueryParams(): void {
  console.log('removing snowplow query params');
  // Only proceed if the _sp parameter exists
  if (window.location.href.includes('_sp=')) {
    // Create a URL object from the current location
    const url = new URL(window.location.href);

    // Remove the _sp parameter
    url.searchParams.delete('_sp');

    // Get the new URL string (this automatically handles the case where no parameters remain)
    const newUrl = url.toString();

    // Update the browser history without reloading the page
    history.replaceState(history.state, '', newUrl);
  }
}

function trackPageView(
  config?: Readonly<PageViewEvent & Snowplow.CommonEventProperties>
): void {
  console.log('tracking page view');
  Snowplow.trackPageView(config);
  removeSnowplowQueryParams();
}

function setUserId(userId?: string | null): void {
  Snowplow.setUserId(userId);
}

function setUserIdFromCookie(cookieName: string): void {
  Snowplow.setUserIdFromCookie(cookieName);
}

export {
  trackRewardEvent,
  trackLinkClick,
  startActivityTracking,
  trackPageView,
  setUserId,
  setUserIdFromCookie,
};
