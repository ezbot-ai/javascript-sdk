/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
import { getPredictions } from './predictions';
const predictions = [
  {
    key: 'hero_headline',
    type: 'basic',
    version: '0.1',
    value: 'Increase Conversions with AI',
    config: null,
  },
  {
    key: 'hero_cta',
    type: 'basic',
    version: '0.1',
    value: 'Explore Benefits',
    config: null,
  },
];
const predictionsResponseBody = {
  holdback: false,
  predictions: predictions,
};
// Mock the projectId and sessionId
const projectId = 123;
const sessionId = 'abc123';

describe('getPredictions', () => {
  describe('when the fetch is successful', () => {
    beforeEach(async () => {
      // Mock the fetch function to return a resolved Promise with the predictions object
      global.fetch = jest.fn(async () => {
        return {
          status: 200,
          json: async () => {
            return predictionsResponseBody;
          },
        } as Response;
      });
    });
    it('should return an array of predictions', async () => {
      // Call the getPredictions function
      const predictions = await getPredictions(projectId, sessionId);

      // Assert that the result is an array
      expect(Array.isArray(predictions)).toBe(true);
    });
  });
  describe('when the fetch is unsuccessful', () => {
    beforeEach(async () => {
      // Mock the fetch function to return a resolved Promise with the predictions object
      global.fetch = jest.fn(async () => {
        return {
          status: 500,
          json: async () => {
            return { error: 'Internal Server Error' };
          },
        } as Response;
      });
    });

    it('should throw an error', async () => {
      const getPredictionsPromise = getPredictions(projectId, sessionId);

      await expect(getPredictionsPromise).rejects.toThrow(
        'Failed to fetch predictions: Got a 500 response'
      );
    });
  });
});
