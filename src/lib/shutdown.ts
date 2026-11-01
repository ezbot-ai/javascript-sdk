/* eslint-disable functional/no-return-void */
/**
 * ezbot.ai has been shut down. Every public SDK method is guarded so that it
 * does nothing except log a console message. The original implementations are
 * preserved in this repository behind these guards.
 */
const SHUTDOWN_MESSAGE =
  'ezbot.ai has been shut down. This SDK is archived and all methods are no-ops.';

const warned = new Set<string>();

const logShutdown = (name: string): void => {
  try {
     
    const first = !warned.has(name) && (warned.add(name), true);
    if (first) {
      console.warn(`[ezbot sdk] ${name}(): ${SHUTDOWN_MESSAGE}`);
    }
  } catch {
    /* never throw from a no-op */
  }
};

/**
 * Wraps `fn` so it never runs. `fallback` produces the inert return value.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function guard<A extends any[], R>(
  name: string,
  _fn: (...args: A) => R,
  fallback: () => R
): (...args: A) => R {
  return (): R => {
    logShutdown(name);
    return fallback();
  };
}

/**
 * Inert stand-in for objects the SDK used to return (e.g. a tracker). Any
 * property access yields a function that returns the same inert object, and it
 * is safe to await.
 */
const createNoopObject = <T>(): T => {
  const noop: unknown = new Proxy(function () {}, {
    get: (_t, prop) => (prop === 'then' ? undefined : noop),
    apply: () => noop,
  });
  return noop as T;
};

export { SHUTDOWN_MESSAGE, guard, createNoopObject, logShutdown };
