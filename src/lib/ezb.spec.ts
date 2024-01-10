// Switch to babel from ts-jest
import { initEzbot } from './ezb';

const predictions = {
  foo: 'bar',
};

describe('Initialization', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(predictions),
      })
    );
  });
  it('initializes', async () => {
    const t = await initEzbot(1, { appId: 'test-app-id' });
    expect(t).toBeDefined();
  });
  it('tracks Page Views', async () => {
    const t = await initEzbot(1, { appId: 'test-app-id' });
    expect(t.trackPageView).toBeDefined();
    t.trackPageView();
    expect(t.trackPageView).toHaveBeenCalled();
  });
});
