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
import { guard } from './shutdown';
import {
  EzbotLinkClickEvent,
  EzbotLinkClickEventPayload,
  EzbotRewardEvent,
  EzbotRewardEventPayload,
} from './types';

function trackRewardEvent(payload: Readonly<EzbotRewardEventPayload>): void {
  if (window.ezbot?.disabled) {
    console.warn('Ezbot SDK is disabled due to payment/subscription issue');
    return;
  }
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
  if (window.ezbot?.disabled) {
    console.warn('Ezbot SDK is disabled due to payment/subscription issue');
    return;
  }
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
  if (window.ezbot?.disabled) {
    console.warn('Ezbot SDK is disabled due to payment/subscription issue');
    return;
  }
  Snowplow.enableActivityTracking(config, [ezbotTrackerId]); // only send to ezbot tracker
}

function removeSnowplowQueryParams(): void {
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
  if (window.ezbot?.disabled) {
    console.warn('Ezbot SDK is disabled due to payment/subscription issue');
    return;
  }
  Snowplow.trackPageView(config);
}

function setUserId(userId?: string | null): void {
  if (window.ezbot?.disabled) {
    console.warn('Ezbot SDK is disabled due to payment/subscription issue');
    return;
  }
  Snowplow.setUserId(userId);
}

function setUserIdFromCookie(cookieName: string): void {
  if (window.ezbot?.disabled) {
    console.warn('Ezbot SDK is disabled due to payment/subscription issue');
    return;
  }
  Snowplow.setUserIdFromCookie(cookieName);
}

// ezbot.ai has been shut down: every exported function is a guarded no-op.
// The original implementations above are preserved for reference.
const noop = () => undefined;
const gTrackRewardEvent = guard('trackRewardEvent', trackRewardEvent, noop);
const gTrackLinkClick = guard('trackLinkClick', trackLinkClick, noop);
const gStartActivityTracking = guard(
  'startActivityTracking',
  startActivityTracking,
  noop
);
const gTrackPageView = guard('trackPageView', trackPageView, noop);
const gSetUserId = guard('setUserId', setUserId, noop);
const gSetUserIdFromCookie = guard(
  'setUserIdFromCookie',
  setUserIdFromCookie,
  noop
);
const gRemoveSnowplowQueryParams = guard(
  'removeSnowplowQueryParams',
  removeSnowplowQueryParams,
  noop
);

export {
  gTrackRewardEvent as trackRewardEvent,
  gTrackLinkClick as trackLinkClick,
  gStartActivityTracking as startActivityTracking,
  gTrackPageView as trackPageView,
  gSetUserId as setUserId,
  gSetUserIdFromCookie as setUserIdFromCookie,
  gRemoveSnowplowQueryParams as removeSnowplowQueryParams,
};
