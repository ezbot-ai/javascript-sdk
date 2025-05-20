/* eslint-disable functional/no-return-void */
import * as Snowplow from '@snowplow/browser-tracker';
import { crossDomainLinker } from '@snowplow/browser-tracker';
import {
  ActivityTrackingConfiguration,
  BrowserTracker,
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

// TODO: consider removing this function after updating snowplow, which should provide a getSessionId function
function getSessionId(tracker: Readonly<BrowserTracker>): string {
  const domainUserInfo = tracker.getDomainUserInfo() as unknown;
  return (domainUserInfo as string[])[6];
}

function setSessionId(
  tracker: Readonly<BrowserTracker>,
  sessionId: string
): void {
  // Attempt to set the session ID in the tracker if the method is available
  // This is a Snowplow method that may or may not be exposed in the TypeScript definitions
  // Using unknown instead of any for better type safety
  const trackerWithSessionId = tracker as unknown as {
    setSessionId: (id: string) => void;
  };
  if (typeof trackerWithSessionId.setSessionId === 'function') {
    trackerWithSessionId.setSessionId(sessionId);
  }
}

/**
 * Extract session ID from URL parameters if it exists
 */
function getSessionIdFromUrl(
  crossDomainConfig: Readonly<CrossDomainConfiguration>
): string | null {
  if (!crossDomainConfig.enabled) {
    return null;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const paramName = crossDomainConfig.linkQueryParameterName || '_ezbot_';
  const sessionIdFromUrl = urlParams.get(paramName);

  if (sessionIdFromUrl) {
    // Clean URL by removing the session parameter (optional, helps with analytics clarity)
    if (window.history && window.history.replaceState) {
      urlParams.delete(paramName);
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? '?' + urlParams.toString() : '') +
        window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }

  return sessionIdFromUrl;
}

/**
 * Determines the session ID to use for tracking based on configuration and URL parameters
 */
function determineSessionId(
  tracker: Readonly<BrowserTracker>,
  crossDomainConfig: Readonly<CrossDomainConfiguration>
): string {
  // Case 1: If a session ID is explicitly provided in config, use it
  if (crossDomainConfig.enabled && crossDomainConfig.sessionId) {
    // Set the session ID in the tracker
    setSessionId(tracker, crossDomainConfig.sessionId);
    return crossDomainConfig.sessionId;
  }

  // Case 2: If cross-domain enabled, look for session ID in URL parameters
  if (crossDomainConfig.enabled) {
    const sessionIdFromUrl = getSessionIdFromUrl(crossDomainConfig);
    if (sessionIdFromUrl) {
      // Set the session ID in the tracker
      setSessionId(tracker, sessionIdFromUrl);
      return sessionIdFromUrl;
    }
  }

  // Case 3: Default - use auto-generated session ID
  return getSessionId(tracker);
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
  getSessionId,
  setSessionId,
  setupCrossDomainLinking,
  getSessionIdFromUrl,
  determineSessionId,
};
