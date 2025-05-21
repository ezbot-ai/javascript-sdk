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

    //eslint-disable-next-line functional/no-let
    let trackerToUse = tracker;
    if (!trackerToUse) {
      trackerToUse = window.ezbot?.tracker;
    }
    if (!trackerToUse) {
      logError(
        new Error('Tracker is not available. Skipping optional params.')
      );
      return requiredParams;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const optionalParams = {
      pageUrlPath: window.location.pathname,
      domainSessionIdx: trackerToUse.getDomainSessionIndex(),
      utmContent: urlParams.get('utm_content') || 'unknown',
      utmMedium: urlParams.get('utm_medium') || 'unknown',
      utmSource: urlParams.get('utm_source') || 'unknown',
      utmCampaign: urlParams.get('utm_campaign') || 'unknown',
      utmTerm: urlParams.get('utm_term') || 'unknown',
      referrer: document.referrer || 'unknown',
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
