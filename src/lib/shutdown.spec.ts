/* eslint-disable functional/no-return-void */
import * as sdk from '../index';

import * as tracking from './tracking';
import * as visual from './visualChanges';

describe('ezbot shutdown guards', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('initEzbot is a no-op that resolves an inert tracker', async () => {
    const tracker = await sdk.initEzbot(1, 'user');
    expect(() => tracker.trackPageView()).not.toThrow();
    expect(window.ezbot).toBeUndefined();
  });

  it('initEzbotWithServerSidePredictions is a no-op', async () => {
    const tracker = await sdk.initEzbotWithServerSidePredictions(1, []);
    expect(tracker).toBeDefined();
    expect(window.ezbot).toBeUndefined();
  });

  it('every function exported from the entry point does nothing but log', () => {
    expect(() => {
      sdk.trackPageView();
      sdk.trackRewardEvent({ name: 'x', value: 1 } as never);
      sdk.trackLinkClick({} as never);
      sdk.startActivityTracking({} as never);
      sdk.setUserId('a');
      sdk.setUserIdFromCookie('c');
      sdk.makeVisualChanges();
      sdk.makeVisualChange({} as never);
    }).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });

  it('server helpers return inert values', async () => {
    const client = sdk.createEzbotClient({});
    await expect(client.getPredictions({ projectId: 1 })).resolves.toEqual([]);
    expect(client.dispose()).toBeUndefined();
    expect(sdk.predictionsToCss([])).toBe('');
    expect(sdk.getVisualForSelector([], 'a')).toBeUndefined();
    expect(sdk.buildQueryParams({ projectId: 1 })).toBe('');
    expect(sdk.generateSessionId()).toBe('');
    expect(sdk.extractUtmFromSearchParams({})).toEqual({});
  });

  it('DOM helpers do not touch the DOM', () => {
    const el = document.createElement('div');
    // eslint-disable-next-line functional/immutable-data
    el.textContent = 'orig';
    visual.setElementText(el, 'changed');
    visual.hideElement(el);
    visual.visualChanges.setElementText(el, 'changed');
    expect(el.textContent).toBe('orig');
    expect(el.style.display).toBe('');
  });

  it('tracking helpers do not throw without a tracker', () => {
    expect(() => tracking.trackPageView()).not.toThrow();
  });

  it('logs once per method', () => {
    sdk.setUserId('a');
    sdk.setUserId('b');
    const calls = (console.warn as jest.Mock).mock.calls.filter((c) =>
      String(c[0]).includes('setUserId()')
    );
    expect(calls.length).toBeLessThanOrEqual(1);
  });
});
