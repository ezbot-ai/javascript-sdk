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
import { TrackerConfiguration } from '@snowplow/browser-tracker-core';
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
const ezbotTrackerDomain = 'https://api.ezbot.ai';
const ezbotRewardEventSchema = 'iglu:com.ezbot/reward_event/jsonschema/1-0-0';
const ezbotLinkClickEventSchema = 'iglu:com.ezbot/link_click/jsonschema/1-0-0';
const ezbotPredictionsContextSchema =
  'iglu:com.ezbot/predictions_context/jsonschema/1-0-1';
const defaultWebConfiguration: TrackerConfiguration = {
  appId: 'default-ezbot-app-id',
  encodeBase64: true,
  cookieName: '_ezbot_',
  plugins: plugins,
};
const ezbotTrackerId = 'ezbot';

export {
  ezbotTrackerDomain,
  ezbotTrackerId,
  ezbotRewardEventSchema,
  ezbotLinkClickEventSchema,
  ezbotPredictionsContextSchema,
  defaultWebConfiguration,
  plugins,
};