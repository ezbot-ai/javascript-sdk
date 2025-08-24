import { request as httpRequest, Agent as HttpAgent, RequestOptions } from 'http';
import { request as httpsRequest, Agent as HttpsAgent } from 'https';
import { URL } from 'url';

import { Prediction, PredictionsResponse } from './types';

export type { Prediction, PredictionsResponse };

export type PredictionsParams = {
  projectId: number | string;
  sessionId?: string;
  userId?: string;
  pageUrlPath?: string;
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  domainSessionIdx?: number;
  tz?: string;
};

export type RequestMeta = {
  userAgent?: string;
  referrer?: string;
  origin?: string;
  headers?: Record<string, string>;
};

export type EzbotServerClientOptions = {
  // Optional. Defaults to production API. Only override for testing.
  baseUrl?: string; // default: https://api.ezbot.ai
  timeoutMs?: number; // overall request timeout in ms
  // One unified agent options bag; https options are a superset and compatible with http
  agentOptions?: ConstructorParameters<typeof HttpsAgent>[0];
};

export type EzbotServerClient = {
  getPredictions: (
    params: PredictionsParams,
    meta?: RequestMeta
  ) => Promise<Array<Prediction>>;
  dispose: () => void;
};

export function extractUtmFromSearchParams(
  obj: Record<string, string | string[] | undefined>
): Pick<PredictionsParams, 'utmSource' | 'utmMedium' | 'utmCampaign' | 'utmContent' | 'utmTerm'> {
  return {
    utmSource: Array.isArray(obj.utm_source) ? obj.utm_source[0] : obj.utm_source,
    utmMedium: Array.isArray(obj.utm_medium) ? obj.utm_medium[0] : obj.utm_medium,
    utmCampaign: Array.isArray(obj.utm_campaign) ? obj.utm_campaign[0] : obj.utm_campaign,
    utmContent: Array.isArray(obj.utm_content) ? obj.utm_content[0] : obj.utm_content,
    utmTerm: Array.isArray(obj.utm_term) ? obj.utm_term[0] : obj.utm_term,
  };
}

export function buildQueryParams(params: PredictionsParams): string {
  const processedParams = {
    projectId: typeof params.projectId === 'number' ? params.projectId.toString() : params.projectId,
    sessionId: params.sessionId ?? generateSessionId(),
    pageUrlPath: params.pageUrlPath ?? '/',
    domainSessionIdx: params.domainSessionIdx,
    utmContent: params.utmContent ?? 'unknown',
    utmMedium: params.utmMedium ?? 'unknown',
    utmSource: params.utmSource ?? 'unknown',
    utmCampaign: params.utmCampaign ?? 'unknown',
    utmTerm: params.utmTerm ?? 'unknown',
    referrer: params.referrer ?? 'unknown',
    tz: params.tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  } as Record<string, string | number | undefined>;

  return Object.entries(processedParams)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
}

export const DEFAULT_API_BASE_URL = 'https://api.ezbot.ai';

export function createEzbotClient(options: EzbotServerClientOptions): EzbotServerClient {
  const { baseUrl = DEFAULT_API_BASE_URL, timeoutMs = 500, agentOptions } = options;

  const isHttpsBase = new URL(baseUrl).protocol === 'https:';
  const agent = isHttpsBase
    ? new HttpsAgent({ keepAlive: true, maxSockets: 50, maxFreeSockets: 10, ...agentOptions })
    : new HttpAgent({ keepAlive: true, maxSockets: 50, maxFreeSockets: 10, ...(agentOptions as ConstructorParameters<typeof HttpAgent>[0]) });

  async function makeRequest(url: string, meta?: RequestMeta): Promise<{ status: number; statusText: string; json: () => Promise<any> }> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const isHttps = parsedUrl.protocol === 'https:';

      const defaultOrigin = meta?.referrer ? new URL(meta.referrer).origin : undefined;

      const headers: Record<string, string> = {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        origin: meta?.origin || defaultOrigin || '',
        referer: meta?.referrer || '',
        'user-agent': meta?.userAgent || '',
        ...meta?.headers,
      };

      const requestOptions: RequestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        agent,
        headers,
      };

      const req = (isHttps ? httpsRequest : httpRequest)(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            statusText: res.statusMessage || '',
            json: async () => JSON.parse(data || '{}'),
          });
        });
      });

      req.on('error', (err) => reject(err));

      // Socket timeout slightly above overall timeout to let race resolve first
      req.setTimeout(Math.max(timeoutMs, 100), () => {
        req.destroy(new Error('Request socket timeout'));
      });

      req.end();

      // Overall timeout guard
      if (timeoutMs > 0) {
        setTimeout(() => {
          try { req.destroy(); } catch { /* noop */ }
          reject(new Error('Request timeout'));
        }, timeoutMs);
      }
    });
  }

  return {
    async getPredictions(params: PredictionsParams, meta?: RequestMeta): Promise<Array<Prediction>> {
      const url = new URL('/predict', baseUrl).toString();
      const qp = buildQueryParams(params);
      const fullUrl = `${url}?${qp}`;

      try {
        const response = await makeRequest(fullUrl, meta);
        if (response.status !== 200) {
          throw new Error(`Failed to fetch predictions: ${response.status}`);
        }
        const responseJSON = (await response.json()) as PredictionsResponse;
        return responseJSON.predictions;
      } catch (e) {
        // For server-side callers, degrade gracefully
        return [];
      }
    },
    dispose() {
      agent.destroy();
    },
  };
}

export function generateSessionId(): string {
  return `ssr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
