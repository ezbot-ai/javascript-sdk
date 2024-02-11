import { Prediction, PredictionsResponse } from './types';

async function getPredictions(
  projectId: number,
  sessionId: string
): Promise<Array<Prediction>> {
  const predictionsURL = `https://api.ezbot.ai/predict?projectId=${projectId}&sessionId=${sessionId}`;
  const response = await fetch(predictionsURL);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch predictions: Got a ${response.status} response;
      }`);
  }
  const responseJSON = (await response.json()) as PredictionsResponse;
  return responseJSON.predictions;
}
export { getPredictions };
