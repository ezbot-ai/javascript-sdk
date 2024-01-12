/* eslint-disable functional/no-return-void */
import { BrowserFeaturesPlugin } from '@snowplow/browser-plugin-browser-features';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { ConsentPlugin } from '@snowplow/browser-plugin-consent';
import { EcommercePlugin } from '@snowplow/browser-plugin-ecommerce';
import { FormTrackingPlugin } from '@snowplow/browser-plugin-form-tracking';
import { GaCookiesPlugin } from '@snowplow/browser-plugin-ga-cookies';
import { GeolocationPlugin } from '@snowplow/browser-plugin-geolocation';
import { LinkClickTrackingPlugin } from '@snowplow/browser-plugin-link-click-tracking';
import { SiteTrackingPlugin } from '@snowplow/browser-plugin-site-tracking';
import { TimezonePlugin } from '@snowplow/browser-plugin-timezone';
import {
  addGlobalContexts,
  BrowserTracker,
  CommonEventProperties,
  enableActivityTracking,
  newTracker,
  trackSelfDescribingEvent,
} from '@snowplow/browser-tracker';
import {
  ActivityTrackingConfiguration,
  PageViewEvent,
  TrackerConfiguration,
} from '@snowplow/browser-tracker-core';

const plugins = [
  GaCookiesPlugin(),
  GeolocationPlugin(),
  ClientHintsPlugin(),
  ConsentPlugin(),
  LinkClickTrackingPlugin(),
  FormTrackingPlugin(),
  TimezonePlugin(),
  EcommercePlugin(),
  SiteTrackingPlugin(),
  BrowserFeaturesPlugin(),
];
const EzbotTrackerDomain = 'https://api.ezbot.ai';
const EzbotRewardEventSchema = 'iglu:com.ezbot/reward_event/jsonschema/1-0-0';
const EzbotPredictionsContextSchema =
  'iglu:com.ezbot/predictions_content/jsonschema/1-0-0';
const DefaultWebConfiguration: TrackerConfiguration = {
  appId: 'default-ezbot-app-id',
  encodeBase64: true,
  cookieName: '_ezbot_',
  plugins: plugins,
};

declare global {
  interface Window {
    ezbot: {
      tracker: BrowserTracker;
      trackPageView: (
        event?: Readonly<PageViewEvent & CommonEventProperties>
      ) => void;
      trackRewardEvent: (payload: Record<string, unknown>) => void;
      startActivityTracking: (
        config: Readonly<ActivityTrackingConfiguration>
      ) => void;
    };
  }
}

type Predictions = Record<string, string>;

type predictionsResponse = {
  predictions: Predictions;
};

const ezbotTrackerId = 'ezbot';
async function getPredictions(
  projectId: number,
  sessionId: string
): Promise<Predictions> {
  const predictionsURL = `https://api.ezbot.ai/predict?projectId=${projectId}&sessionId=${sessionId}`;
  const response = await fetch(predictionsURL);
  const responseJSON = await response.json();
  return (responseJSON as predictionsResponse).predictions;
}

async function initEzbot(
  projectId: number,
  config: TrackerConfiguration = DefaultWebConfiguration
): Promise<BrowserTracker> {
  const tracker = newTracker(ezbotTrackerId, EzbotTrackerDomain, {
    appId: config.appId,
    plugins: plugins,
  });
  if (tracker === null) {
    throw new Error('Failed to initialize tracker');
  }

  const domainUserInfo = tracker.getDomainUserInfo() as unknown;
  const sessionId = (domainUserInfo as string[])[6];
  const predictions = await getPredictions(projectId, sessionId);
  const predictionsContext = {
    schema: EzbotPredictionsContextSchema,
    data: predictions,
  };
  addGlobalContexts([predictionsContext], [tracker.id]);
  // eslint-disable-next-line functional/immutable-data
  window.ezbot = {
    tracker: tracker,
    trackPageView: tracker.trackPageView, // only send to ezbot tracker
    trackRewardEvent: trackRewardEvent,
    startActivityTracking: startActivityTracking,
  };

  return tracker;
}

function trackRewardEvent(payload: Record<string, unknown>): void {
  trackSelfDescribingEvent(
    {
      event: {
        schema: EzbotRewardEventSchema,
        data: payload,
      },
    },
    [ezbotTrackerId] // only send to ezbot tracker
  );
}

function startActivityTracking(
  config: Readonly<ActivityTrackingConfiguration>
): void {
  enableActivityTracking(config, [ezbotTrackerId]); // only send to ezbot tracker
}

export { trackRewardEvent, initEzbot, startActivityTracking };
