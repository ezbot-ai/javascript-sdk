/* eslint-disable functional/no-loop-statements, functional/prefer-immutable-types, functional/no-return-void, functional/immutable-data, functional/no-let */
import * as snowplow from '@snowplow/browser-tracker';

import * as sdk from '../index';

import * as ezbotMod from './ezbot';
import * as predictionHelpers from './predictionHelpers';
import * as predictions from './predictions';
import * as serverPredictions from './serverPredictions';
import { resetShutdownLog } from './shutdown';
import * as tracking from './tracking';
import * as visual from './visualChanges';

jest.mock('@snowplow/browser-tracker');

type Fn = (...args: unknown[]) => unknown;

// Every module that exposes callable SDK surface.
const modules: Record<string, Record<string, unknown>> = {
  index: sdk,
  ezbot: ezbotMod,
  tracking,
  visualChanges: visual,
  predictions,
  predictionHelpers,
  serverPredictions,
};

const functionsOf = (mod: Record<string, unknown>): Array<[string, Fn]> =>
  Object.entries(mod).filter(([, v]) => typeof v === 'function') as Array<
    [string, Fn]
  >;

// Hostile / realistic argument sets. No-ops must tolerate all of them.
const argSets: unknown[][] = [
  [],
  [1, 'user', {}],
  ['', null, undefined],
  [{ projectId: 1 }, { userAgent: 'x' }],
  [document.createElement('div'), 'text'],
  [
    {
      key: 'k',
      type: 'visual',
      value: 'v',
      config: { selector: 'div', action: 'hide' },
    },
  ],
];

describe('shutdown: every public function is a no-op', () => {
  let warn: jest.SpyInstance;
  let fetchSpy: jest.Mock;

  beforeEach(() => {
    resetShutdownLog();
    warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    fetchSpy = jest.fn();
    (global as unknown as { fetch: unknown }).fetch = fetchSpy;
    document.body.innerHTML = '<div id="a">orig</div>';
    delete (window as { ezbot?: unknown }).ezbot;
  });

  afterEach(() => jest.restoreAllMocks());

  it('discovers a meaningful number of exports', () => {
    expect(functionsOf(sdk).length).toBeGreaterThanOrEqual(15);
  });

  for (const [modName, mod] of Object.entries(modules)) {
    for (const [fnName, fn] of functionsOf(mod)) {
      // Pure type/constant helpers excluded below by explicit allow-list.
      it(`${modName}.${fnName} never throws and logs shutdown`, async () => {
        for (const args of argSets) {
          let result: unknown;
          expect(() => {
            result = fn(...args);
          }).not.toThrow();
          // Promises must resolve, never reject.
          if (
            result &&
            typeof (result as Promise<unknown>).then === 'function'
          ) {
            await expect(
              result as Promise<unknown>
            ).resolves.not.toBeInstanceOf(Error);
          }
        }
        expect(warn).toHaveBeenCalledWith(
          expect.stringContaining('ezbot.ai has been shut down')
        );
      });

      it(`${modName}.${fnName} has no side effects`, async () => {
        const before = document.body.innerHTML;
        for (const args of argSets) {
          const r = fn(...args);
          if (r && typeof (r as Promise<unknown>).then === 'function') await r;
        }
        expect(document.body.innerHTML).toBe(before);
        expect(document.head.innerHTML).toBe('');
        expect((window as { ezbot?: unknown }).ezbot).toBeUndefined();
        expect(fetchSpy).not.toHaveBeenCalled();
        // No Snowplow call of any kind
        for (const v of Object.values(snowplow)) {
          if (jest.isMockFunction(v)) expect(v).not.toHaveBeenCalled();
        }
      });
    }
  }

  it('init functions never create a tracker or contact the network', async () => {
    await sdk.initEzbot(123, 'u', {
      crossDomain: { enabled: true, domains: [] },
    } as never);
    await sdk.initEzbotWithServerSidePredictions(123, [], 'u');
    expect(snowplow.newTracker).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(window.ezbot).toBeUndefined();
  });

  it('server client does no I/O and returns empty results', async () => {
    const client = serverPredictions.createEzbotClient({
      baseUrl: 'http://127.0.0.1:1',
      timeoutMs: 1,
    });
    await expect(client.getPredictions({ projectId: 1 })).resolves.toEqual([]);
    expect(client.dispose()).toBeUndefined();
  });

  it('returns inert values', () => {
    expect(
      predictionHelpers.predictionsToCss([
        {
          key: 'k',
          type: 'visual',
          value: 'v',
          version: '1',
          config: { selector: 'a', action: 'hide' },
        } as never,
      ])
    ).toBe('');
    expect(predictionHelpers.getVisualForSelector([], 'a')).toBeUndefined();
    expect(serverPredictions.buildQueryParams({ projectId: 1 })).toBe('');
    expect(serverPredictions.generateSessionId()).toBe('');
  });
});
