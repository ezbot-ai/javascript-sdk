import { BrowserFeaturesPlugin } from '@snowplow/browser-plugin-browser-features';
import { ButtonClickTrackingPlugin } from '@snowplow/browser-plugin-button-click-tracking';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { ConsentPlugin } from '@snowplow/browser-plugin-consent';
import { EcommercePlugin } from '@snowplow/browser-plugin-ecommerce';
import { GaCookiesPlugin } from '@snowplow/browser-plugin-ga-cookies';
import { LinkClickTrackingPlugin } from '@snowplow/browser-plugin-link-click-tracking';
import { SiteTrackingPlugin } from '@snowplow/browser-plugin-site-tracking';
import { TimezonePlugin } from '@snowplow/browser-plugin-timezone';
import { TrackerConfiguration } from '@snowplow/browser-tracker-core';
const plugins = [
  GaCookiesPlugin(),
  ClientHintsPlugin(),
  ConsentPlugin(),
  LinkClickTrackingPlugin(),
  TimezonePlugin(),
  EcommercePlugin(),
  SiteTrackingPlugin(),
  BrowserFeaturesPlugin(),
  ButtonClickTrackingPlugin(),
];
const ezbotTrackerDomain = 'https://data.api.ezbot.ai';
const ezbotRewardEventSchemaPath =
  'iglu:com.ezbot/reward_event/jsonschema/1-0-0';
const ezbotLinkClickEventSchemaPath =
  'iglu:com.ezbot/link_click/jsonschema/1-0-0';
const ezbotPredictionsContextSchemaPath =
  'iglu:com.ezbot/predictions_context/jsonschema/1-0-1';
const defaultWebConfiguration: TrackerConfiguration = {
  appId: 'default-ezbot-app-id',
  encodeBase64: true,
  cookieName: '_ezbot_',
  plugins: plugins,
};
const ezbotTrackerId = 'ezbot';
const globalVisualChanges = ['addGlobalCSS'];

export {
  ezbotTrackerDomain,
  ezbotTrackerId,
  ezbotRewardEventSchemaPath,
  ezbotLinkClickEventSchemaPath,
  ezbotPredictionsContextSchemaPath,
  defaultWebConfiguration,
  plugins,
  globalVisualChanges,
};
