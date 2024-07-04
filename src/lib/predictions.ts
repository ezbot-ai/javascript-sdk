import { BrowserTracker } from '@snowplow/browser-tracker';

import { Prediction, PredictionsResponse } from './types';
import { logError } from './utils';

type RequiredPredictionsParams = {
  projectId: string;
  sessionId: string;
};

type OptionalPredictionsParams = {
  pageUrlPath?: string;
};

type PredictionsParams = RequiredPredictionsParams & OptionalPredictionsParams;

function buildParams(
  projectId: number,
  sessionId: string,
  tracker?: Readonly<BrowserTracker>
): PredictionsParams {
  const requiredParams = {
    projectId: projectId.toString(),
    sessionId,
  } as PredictionsParams;
  try {
    // TODO: should allow params to fail and fallback to "unknowns"
    // one by one, not as a whole
    if (!tracker && !window.ezbot?.tracker) {
      logError(
        new Error('Tracker is not available. Skipping optional params.')
      );
      return requiredParams;
    }
    if (!tracker) {
      tracker = window.ezbot.tracker;
    }
    const optionalParams = {
      pageUrlPath: window.location.pathname,
      domainSessionIdx: tracker.getDomainSessionIndex(),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return { ...requiredParams, ...optionalParams };
  } catch (e) {
    logError(e as Error);
    return requiredParams;
  }
}

const buildQueryParams = (params: Record<string, string | number>): string => {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
};

async function getPredictions(
  projectId: number,
  sessionId: string,
  tracker?: Readonly<BrowserTracker>
): Promise<Array<Prediction>> {
  const basePredictionsURL = `https://api.ezbot.ai/predict`;
  const params = buildParams(projectId, sessionId, tracker);
  const queryParams = buildQueryParams(params);
  const predictionsURL = `${basePredictionsURL}?${queryParams}`;

  const response = await fetch(predictionsURL);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch predictions: Got a ${response.status} response;
      }`);
  }
  const responseJSON = (await response.json()) as PredictionsResponse;
  return responseJSON.predictions;
}
export {
  getPredictions,
  RequiredPredictionsParams,
  OptionalPredictionsParams,
  PredictionsParams,
};
