import { BrowserFeaturesPlugin } from '@snowplow/browser-plugin-browser-features';
import { ButtonClickTrackingPlugin } from '@snowplow/browser-plugin-button-click-tracking';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { ConsentPlugin } from '@snowplow/browser-plugin-consent';
import { EcommercePlugin } from '@snowplow/browser-plugin-ecommerce';
import { GaCookiesPlugin } from '@snowplow/browser-plugin-ga-cookies';
import { LinkClickTrackingPlugin } from '@snowplow/browser-plugin-link-click-tracking';
import { SiteTrackingPlugin } from '@snowplow/browser-plugin-site-tracking';
import { TimezonePlugin } from '@snowplow/browser-plugin-timezone';
import {
  ClientSession,
  TrackerConfiguration,
} from '@snowplow/browser-tracker-core';

import { CrossDomainConfiguration } from './types';
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

// eslint-disable-next-line functional/no-return-void
const onSessionUpdateCallback = (clientSession?: Readonly<ClientSession>) => {
  if (
    typeof window !== 'undefined' &&
    window.ezbot &&
    typeof window.ezbot === 'object' &&
    Object.prototype.hasOwnProperty.call(window.ezbot, 'sessionId')
  ) {
    if (clientSession && clientSession.sessionId) {
      // This is an intentional side effect to update the global state
      // eslint-disable-next-line functional/immutable-data
      window.ezbot.sessionId = clientSession.sessionId;
    }
  }
};

const defaultCrossDomainConfiguration: CrossDomainConfiguration = {
  enabled: false,
  linkQueryParameterName: '_ezbot_',
  decorateLinks: true,
  usePostForCrossDomainDelivery: false,
};

const defaultWebConfiguration: TrackerConfiguration = {
  appId: 'default-ezbot-app-id',
  encodeBase64: true,
  cookieName: '_ezbot_',
  plugins: plugins,
  onSessionUpdateCallback: onSessionUpdateCallback,
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
  defaultCrossDomainConfiguration,
  plugins,
  globalVisualChanges,
};
