// Must disable no-let and immutable-data linting because JSDOM is common to all tests
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */

/* eslint-disable functional/no-return-void */
import { trackPageView } from '@snowplow/browser-tracker';
import { BrowserTracker } from '@snowplow/browser-tracker-core';
import Ajv from 'ajv';

import { initEzbot } from './ezbot';
import * as predictionsContextSchema from './schemas/com.ezbot/predictions_context/jsonschema/1-0-1.json';
import { startActivityTracking, trackRewardEvent } from './tracking';
import { EzbotPredictionsContext } from './types';

const ajv = new Ajv();
const validatePredictionsContextSchema = ajv.compile<EzbotPredictionsContext>(
  predictionsContextSchema
);

const predictions = [
  {
    key: 'hero_headline',
    type: 'basic',
    version: '0.1',
    value: 'Increase Conversions with AI',
    config: null,
  },
  {
    key: 'hero_cta',
    type: 'basic',
    version: '0.1',
    value: 'Explore Benefits',
    config: null,
  },
];

const predictionsResponseBody = {
  holdback: false,
  predictions: predictions,
};

const mockTrackPageView = jest.fn();

let tracker: BrowserTracker;

type PostEvent = {
  evt: Record<string, unknown>;
  bytes: number;
};

type Context = {
  data: Record<string, string>;
  schema: string;
};

type Outqueue = PostEvent[];

function decodeContexts(contexts: string): Context[] {
  const decoded = atob(contexts);
  return JSON.parse(decoded).data;
}
function decodeUnstructuredEventPayload(ue_px: string): Context {
  const decoded = atob(ue_px);
  return JSON.parse(decoded).data;
}

function clearEventQueue() {
  (tracker.sharedState.outQueues[0] as Outqueue).pop();
}
// function clearCookies() {
//   document.cookie.split(';').forEach((cookie) => {
//     document.cookie = cookie
//       .replace(/^ +/, '')
//       .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
//   });
// }
describe('ezbot js tracker', () => {
  beforeEach(async () => {
    // Mock the fetch function to return a resolved Promise with the predictions object
    global.fetch = jest.fn(async () => {
      return {
        status: 200,
        json: async () => {
          return predictionsResponseBody;
        },
      } as Response;
    });
    // Add ezbot tracker to jsdom DOM
    tracker = await initEzbot(1, undefined, { appId: 'test-app-id' });
  });
  afterEach(async () => {
    clearEventQueue();
    // delete window.ezbot;
    // localStorage.clear();
    // clearCookies();
  });
  it('initializes', () => {
    expect(tracker).toBeDefined();
    const sessionId = (tracker.getDomainUserInfo() as unknown as string[])[6];
    const domainSessionIdx =
      tracker.getDomainSessionIndex() as unknown as number;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || 'unknown';
    const utmMedium = urlParams.get('utm_medium') || 'unknown';
    const utmCampaign = urlParams.get('utm_campaign') || 'unknown';
    const utmTerm = urlParams.get('utm_term') || 'unknown';
    const utmContent = urlParams.get('utm_content') || 'unknown';
    const referrer = document.referrer || 'unknown';
    const predictionsURL = new URL('https://api.ezbot.ai/predict');
    predictionsURL.searchParams.set('projectId', '1');
    predictionsURL.searchParams.set('sessionId', sessionId);
    predictionsURL.searchParams.set('pageUrlPath', window.location.pathname);
    predictionsURL.searchParams.set(
      'domainSessionIdx',
      domainSessionIdx.toString()
    );
    predictionsURL.searchParams.set('utmContent', utmContent);
    predictionsURL.searchParams.set('utmMedium', utmMedium);
    predictionsURL.searchParams.set('utmCampaign', utmCampaign);
    predictionsURL.searchParams.set('utmSource', utmSource);
    predictionsURL.searchParams.set('utmTerm', utmTerm);
    predictionsURL.searchParams.set('referrer', referrer);
    predictionsURL.searchParams.set('tz', tz);

    const calledURL = new URL((global.fetch as jest.Mock).mock.calls[0][0]);
    predictionsURL.searchParams.forEach((value, key) => {
      expect(calledURL.searchParams.get(key)).toEqual(value);
    });
  });
  it('sets predictions in global context', async () => {
    trackPageView();
    const eventOutQueue = tracker.sharedState.outQueues[0];
    const firstEvent = (eventOutQueue as Outqueue)[0];
    const contexts = firstEvent.evt.cx;
    const decodedContexts = decodeContexts(contexts as string);
    expect(decodedContexts).toContainEqual({
      data: {
        predictions: predictions.map((p) => ({
          variable: p.key,
          value: p.value,
        })),
      },
      schema: 'iglu:com.ezbot/predictions_context/jsonschema/1-0-1',
    });
  });
  it('sets valid predictions context to correct schema version 1-0-1', async () => {
    trackPageView();
    const eventOutQueue = tracker.sharedState.outQueues[0];
    const firstEvent = (eventOutQueue as Outqueue)[0];
    const contexts = firstEvent.evt.cx;
    const decodedContexts: Context[] = decodeContexts(contexts as string);

    expect(
      validatePredictionsContextSchema(decodedContexts[2].data)
    ).toBeTruthy();
  });
  it('exposes a global trackPageView function', async () => {
    expect(tracker.trackPageView).toBeDefined();
    tracker.trackPageView = mockTrackPageView;
    trackPageView();
    expect(tracker.trackPageView).toHaveBeenCalled();
  });
  it('exposes a global trackRewardEvent function', () => {
    expect(window.ezbot?.trackRewardEvent).toBeDefined();
  });
  it('has a track reward function that sends a reward event', () => {
    trackRewardEvent({ key: 'foo' });
    const eventOutQueue = tracker.sharedState.outQueues[0];
    const firstEvent = (eventOutQueue as Outqueue)[0];
    expect(firstEvent.evt.e).toEqual('ue'); // ue = unstructured event
    const contexts = firstEvent.evt.ue_px; // ue_px = unstructured event payload
    const decodedContexts = decodeUnstructuredEventPayload(contexts as string);
    expect(decodedContexts).toEqual({
      data: { key: 'foo' },
      schema: 'iglu:com.ezbot/reward_event/jsonschema/1-0-0',
    });
  });
  it('exposes a global startActivityTracking', async () => {
    expect(window.ezbot?.startActivityTracking).toBeDefined();
  });
  it('has a start activity tracking function that triggers OOB activity tracking', async () => {
    const config = {
      minimumVisitLength: 10,
      heartbeatDelay: 10,
    };
    tracker.enableActivityTracking = jest.fn();
    startActivityTracking(config);
    expect(tracker.enableActivityTracking).toHaveBeenCalled();
  });
  it('exposes a global trackPageView function', async () => {
    expect(tracker.trackPageView).toBeDefined();
    expect(window.ezbot?.trackPageView).toBeDefined();
  });
  it('exposes a global makeVisualChanges function', async () => {
    expect(window.ezbot?.makeVisualChanges).toBeDefined();
  });
});
describe('ezbot init', () => {
  beforeEach(async () => {
    // Mock the fetch function to return a resolved Promise with the predictions object
    global.fetch = jest.fn(async () => {
      return {
        status: 200,
        json: async () => {
          return predictionsResponseBody;
        },
      } as Response;
    });
  });
  it('can initialize with userId without config', async () => {
    const testUserId = 'test-user-123';
    const customTracker = await initEzbot(1, testUserId);
    expect(customTracker).toBeDefined();
    expect(customTracker.getUserId()).toEqual(testUserId);
  });
  it('can initialize without userId with cross-domain enabled', async () => {
    const customTracker = await initEzbot(98, null, {
      crossDomain: {
        enabled: true,
        domains: ['https://example.com'],
      },
    });
    expect(customTracker).toBeDefined();
    expect(customTracker.getUserId()).toEqual(null);
  });
  it('can initialize with userId with cross-domain enabled', async () => {
    const testUserId = 'test-user-123';
    const customTracker = await initEzbot(1, testUserId, {
      crossDomain: {
        enabled: true,
        domains: ['https://example.com'],
      },
    });
    expect(customTracker).toBeDefined();
    expect(customTracker.getUserId()).toEqual(testUserId);
  });
});
