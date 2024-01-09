import { TrackerConfiguration } from '@snowplow/browser-tracker-core';
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
import { newTracker, BrowserTracker } from '@snowplow/browser-tracker';

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

  constructor(
    projectId: number,
    config: TrackerConfiguration = DefaultWebConfiguration
  ) {
    this.config = config;
    this.projectId = projectId;
    this.tracker = newTracker('ezbot', EzbotTrackerDomain, {
      appId: config.appId,
      plugins: plugins,
    });
    // TODO: set context
  }

  trackPageView() {
    // TODO
  }

  track() {
    // TODO
  }

  getPredictions() {
    // TODO
  }

  startBackgroundTracking() {
    // TODO
  }
}

export {
  EzbotBrowserTracker,
  TrackerConfiguration,
  DefaultWebConfiguration,
  EzbotTrackerDomain,
};
