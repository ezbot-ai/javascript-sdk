// Switch to babel from ts-jest
import { trackPageView } from '@snowplow/browser-tracker';
import { initEzbot } from './ezb';
import { BrowserTracker } from '@snowplow/browser-tracker-core';

const predictions = {
  foo: 'bar',
};

const mockTrackPageView = jest.fn();

describe('Initialization', () => {
  beforeAll(async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(predictions),
      })
    );
    global.tracker = await initEzbot(1, { appId: 'test-app-id' });
  });
  it('initializes', async () => {
    expect(global.tracker).toBeDefined();
  });
  it('tracks Page Views', async () => {
    const t = global.tracker as BrowserTracker;
    expect(t.trackPageView).toBeDefined();
    t.trackPageView = mockTrackPageView;
    trackPageView();
    expect(t.trackPageView).toHaveBeenCalled();
  });
});
