// These tests are in a separate file so that initialization can be tested separately from the rest of the tracker
// This is necessary because JSDOM is reset between *files*

/* eslint-disable functional/immutable-data */
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
import { newTracker } from '@snowplow/browser-tracker';

import { initEzbot } from './ezbot';

const EzbotTrackerDomain = 'https://api.ezbot.ai';
const predictions = {
  foo: 'bar',
};
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
const testAppId = 'test-app-id';
// const mockDomainUserInfo: string[] = [];
// const mockTracker = jest.fn(() => {
//   return {
//     getDomainUserInfo: () => mockDomainUserInfo,
//   } as unknown as BrowserTracker;
// });
// jest.mock('@snowplow/browser-tracker', () => ({
//   newTracker: jest.fn().mockImplementation(() => mockTracker),
// }));

const mockedNewTracker = jest.mocked(newTracker);
jest.mock('@snowplow/browser-tracker', () => ({
  newTracker: jest.fn().mockImplementation(() => []),
}));

describe('ezbot js tracker', () => {
  beforeAll(() => {
    global.fetch = () => {
      return Promise.resolve({
        json: async () => {
          return { predictions: predictions };
        },
      }) as Promise<Response>;
    };
  });
  it('initializes with no given configuration', async () => {
    await initEzbot(1);
    expect(mockedNewTracker).toHaveBeenCalledWith('ezbot', EzbotTrackerDomain, {
      appId: testAppId,
      plugins: plugins,
    });
  });
  it('initializes with given configuration', async () => {
    await initEzbot(1, { appId: testAppId });
    expect(mockedNewTracker).toHaveBeenCalledWith('ezbot', EzbotTrackerDomain, {
      appId: testAppId,
      plugins: plugins,
    });
  });
});
