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

function buildParams(projectId: number, sessionId: string): PredictionsParams {
  const requiredParams = {
    projectId: projectId.toString(),
    sessionId,
  } as PredictionsParams;
  try {
    const optionalParams = {
      pageUrlPath: window.location.pathname,
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
  sessionId: string
): Promise<Array<Prediction>> {
  const basePredictionsURL = `https://api.ezbot.ai/predict`;
  const params = buildParams(projectId, sessionId);
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
