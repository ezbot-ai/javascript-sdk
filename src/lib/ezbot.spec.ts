// Must disable no-let and immutable-data linting because JSDOM is common to all tests
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */

/* eslint-disable functional/no-return-void */
import { trackPageView } from '@snowplow/browser-tracker';
import { BrowserTracker } from '@snowplow/browser-tracker-core';

import { initEzbot } from './ezbot';
import { startActivityTracking, trackRewardEvent } from './tracking';

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
    tracker = await initEzbot(1, { appId: 'test-app-id' });
  });
  it('initializes', () => {
    expect(tracker).toBeDefined();
    const sessionId = (tracker.getDomainUserInfo() as unknown as string[])[6];
    const predictionsURL = `https://api.ezbot.ai/predict?projectId=1&sessionId=${sessionId}`;
    expect(global.fetch).toHaveBeenCalledWith(predictionsURL);
  });
  it('sets predictions in global context', () => {
    trackPageView();
    const eventOutQueue = tracker.sharedState.outQueues[0];
    const firstEvent = (eventOutQueue as Outqueue)[0];
    const contexts = firstEvent.evt.cx;
    const decodedContexts = decodeContexts(contexts as string);
    expect(decodedContexts).toContainEqual({
      data: { predictions: predictions },
      schema: 'iglu:com.ezbot/predictions_context/jsonschema/1-0-1',
    });
  });
  it('exposes a global trackPageView function', () => {
    expect(tracker.trackPageView).toBeDefined();
    tracker.trackPageView = mockTrackPageView;
    trackPageView();
    expect(tracker.trackPageView).toHaveBeenCalled();
    clearEventQueue();
  });
  it('exposes a global trackRewardEvent function', () => {
    expect(window.ezbot.trackRewardEvent).toBeDefined();
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
    clearEventQueue();
  });
  it('exposes a global startActivityTracking', async () => {
    expect(window.ezbot.startActivityTracking).toBeDefined();
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
    expect(window.ezbot.trackPageView).toBeDefined();
  });
  it('exposes a global makeVisualChanges function', async () => {
    expect(window.ezbot.makeVisualChanges).toBeDefined();
  });
});
