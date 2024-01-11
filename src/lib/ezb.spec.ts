// Switch to babel from ts-jest
import { trackPageView } from '@snowplow/browser-tracker';
import { initEzbot, trackRewardEvent, startActivityTracking } from './ezb';
import { BrowserTracker } from '@snowplow/browser-tracker-core';

const predictions = {
  foo: 'bar',
};

const mockTrackPageView = jest.fn();

let tracker: BrowserTracker;
let outQueue: Array<PostEvent>;

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
  beforeAll(async () => {
    // Mock the fetch function to return a resolved Promise with the predictions object
    global.fetch = jest.fn(async () => {
      return {
        json: async () => {
          return { predictions: predictions };
        },
      };
    });
    // Add ezbot tracker to jsdom DOM
    tracker = await initEzbot(1, { appId: 'test-app-id' });
    const sessionId = (tracker.getDomainUserInfo() as unknown as string[])[6];
    const predictionsURL = `https://api.ezbot.ai/predict?projectId=1&sessionId=${sessionId}`;
    expect(global.fetch).toHaveBeenCalledWith(predictionsURL);
    outQueue = tracker.sharedState.outQueues[0] as Outqueue;
  });
  // afterEach(() => {
  //   tracker.sharedState.outQueues[0] = [];
  // });
  it('initializes', async () => {
    expect(tracker).toBeDefined();
  });
  it('sets predictions in global context', async () => {
    trackPageView();
    const eventOutQueue = tracker.sharedState.outQueues[0];
    const firstEvent = (eventOutQueue as Outqueue)[0];
    const contexts = firstEvent.evt.cx;
    const decodedContexts = decodeContexts(contexts as string);
    expect(decodedContexts).toContainEqual({
      data: predictions,
      schema: 'iglu:com.ezbot/predictions_content/jsonschema/1-0-0',
    });
  });
  it('exposes a global getDomainUserInfo function', async () => {
    expect(tracker.getDomainUserInfo).toBeDefined();
    tracker.trackPageView = mockTrackPageView;
    trackPageView();
    expect(tracker.trackPageView).toHaveBeenCalled();
  });
  it('exposes a global trackPageView function', async () => {
    expect(tracker.trackPageView).toBeDefined();
    tracker.trackPageView = mockTrackPageView;
    trackPageView();
    expect(tracker.trackPageView).toHaveBeenCalled();
    clearEventQueue();
  });
  it('exposes a global trackRewardEvent function', async () => {
    expect(window.ezbot.trackRewardEvent).toBeDefined();
  });
  it('has a track reward function that sends a reward event', async () => {
    trackRewardEvent({ bar: 'baz' });
    const eventOutQueue = tracker.sharedState.outQueues[0];
    const firstEvent = (eventOutQueue as Outqueue)[0];
    expect(firstEvent.evt.e).toEqual('ue'); // ue = unstructured event
    const contexts = firstEvent.evt.ue_px; // ue_px = unstructured event payload
    const decodedContexts = decodeUnstructuredEventPayload(contexts as string);
    expect(decodedContexts).toEqual({
      data: { bar: 'baz' },
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
});
