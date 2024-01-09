import {
  ActivityTrackingConfiguration,
  TrackerConfiguration,
} from '@snowplow/browser-tracker-core';
import { GaCookiesPlugin } from '@snowplow/browser-plugin-ga-cookies';
import { GeolocationPlugin } from '@snowplow/browser-plugin-geolocation';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { ConsentPlugin } from '@snowplow/browser-plugin-consent';
import { LinkClickTrackingPlugin } from '@snowplow/browser-plugin-link-click-tracking';
import { FormTrackingPlugin } from '@snowplow/browser-plugin-form-tracking';
import { TimezonePlugin } from '@snowplow/browser-plugin-timezone';
import { EcommercePlugin } from '@snowplow/browser-plugin-ecommerce';
import { SiteTrackingPlugin } from '@snowplow/browser-plugin-site-tracking';
import { BrowserFeaturesPlugin } from '@snowplow/browser-plugin-browser-features';
import {
  newTracker,
  BrowserTracker,
  trackSelfDescribingEvent,
  trackPageView,
  PageViewEvent,
  CommonEventProperties,
  enableActivityTracking,
} from '@snowplow/browser-tracker';

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
const EzbotSessionContextSchema =
  'iglu:com.ezbot/session_context/jsonschema/1-0-0';

type Predictions = Record<string, string>;

type predictionsResponse = {
  predictions: Predictions;
};

type SessionContext = {
  schema: string;
  data: {
    sessionId: string;
  };
};

const DefaultWebConfiguration: TrackerConfiguration = {
  appId: 'default-ezbot-app-id',
  encodeBase64: true,
  cookieName: '_ezbot_',
  plugins: plugins,
};

class EzbotBrowserTracker {
  config: TrackerConfiguration;
  projectId: number;
  tracker: BrowserTracker;
  sessionId: string;
  predictions: Predictions;

  constructor(
    projectId: number,
    config: TrackerConfiguration = DefaultWebConfiguration
  ) {
    this.config = config;
    this.projectId = projectId;
    // TODO generate new session id, set it as ezbot session id, and add it to the contexts
    this.sessionId = 'abc';

    (async () => {
      this.predictions = await this.getPredictions();
    })();
    // TODO Add predictions context

    this.tracker = newTracker('ezbot', EzbotTrackerDomain, {
      appId: config.appId,
      plugins: plugins,
      contexts: [],
    });
  }

  trackPageView(
    event?:
      | (PageViewEvent & CommonEventProperties<Record<string, unknown>>)
      | undefined
  ) {
    trackPageView(event, [this.tracker.id]);
  }

  trackRewardEvent(payload: Record<string, unknown>) {
    trackSelfDescribingEvent(
      {
        event: {
          schema: EzbotRewardEventSchema,
          data: payload,
        },
      },
      [this.tracker.id]
    );
  }

  async getPredictions() {
    const predictionsURL = `https://api.ezbot.ai/predict?projectId=${this.projectId}&sessionId=${this.sessionId}`;
    const response = await fetch(predictionsURL);
    const responseJSON = await response.json();
    this.predictions = (responseJSON as predictionsResponse).predictions;

    return this.predictions;
  }

  startBackgroundTracking(config: ActivityTrackingConfiguration) {
    enableActivityTracking(config, [this.tracker.id]);
  }
}

export {
  EzbotBrowserTracker,
  TrackerConfiguration,
  DefaultWebConfiguration,
  EzbotTrackerDomain,
};
