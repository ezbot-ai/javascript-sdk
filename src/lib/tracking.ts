/* eslint-disable functional/no-return-void */
import * as Snowplow from '@snowplow/browser-tracker';
import { crossDomainLinker } from '@snowplow/browser-tracker';
import {
  ActivityTrackingConfiguration,
  PageViewEvent,
} from '@snowplow/browser-tracker-core';

import {
  ezbotLinkClickEventSchemaPath,
  ezbotRewardEventSchemaPath,
  ezbotTrackerId,
} from './constants';
import { CrossDomainConfiguration } from './types';
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

function setUserId(userId?: string | null): void {
  Snowplow.setUserId(userId);
}

function setUserIdFromCookie(cookieName: string): void {
  Snowplow.setUserIdFromCookie(cookieName);
}

/**
 * Setup cross-domain linking by decorating links with the session ID parameter
 */
function setupCrossDomainLinking(
  crossDomainConfig: Readonly<CrossDomainConfiguration>
): void {
  // Enable cross-domain linking if configured
  if (crossDomainConfig?.enabled) {
    // If a custom filter function is provided, use it; otherwise, use the default domain-based filter
    const linkerFunc =
      crossDomainConfig.crossDomainLinkerFilter ||
      function (elt: Readonly<HTMLAnchorElement | HTMLAreaElement>) {
        // Only proceed if we have domains configured
        if (
          !crossDomainConfig.domains ||
          crossDomainConfig.domains.length === 0
        ) {
          return false;
        }

        const href = elt.href || '';
        // Check if the href contains any of the specified domains
        return crossDomainConfig.domains.some(
          (domain) => href.indexOf(domain) !== -1
        );
      };

    // Configure cross-domain linking options
    // Note: Snowplow's crossDomainLinker function decorates links with appropriate parameters
    // for cross-domain tracking

    // Set up the cross-domain query parameter if specified
    if (crossDomainConfig.linkQueryParameterName) {
      // Apply the configuration through crossDomainLinker function
      // This will add the session ID parameter to links that match the linker function
      crossDomainLinker(linkerFunc);
    }
  }
}

export {
  trackRewardEvent,
  trackLinkClick,
  startActivityTracking,
  trackPageView,
  setUserId,
  setUserIdFromCookie,
  setupCrossDomainLinking,
};
