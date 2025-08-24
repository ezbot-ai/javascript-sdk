# ezbot Javascript SDK

The easiest way to interact with ezbot via JS (browser). For ease of use, our Javascript library wraps Snowplow's [Browser Tracker](https://www.npmjs.com/package/@snowplow/browser-tracker) (BSD-3 License).

## Docs

For full documentation, please visit [docs.ezbot.ai](https://docs.ezbot.ai/).

## Server-side predictions (Node)

Use the server client to fetch predictions from backend code (e.g., Next.js Route Handlers, RSC/SSR, Express, serverless functions).

```ts
import { createEzbotClient, type PredictionsParams, type RequestMeta } from '@ezbot-ai/javascript-sdk';

// Create a client. By default, baseUrl is https://api.ezbot.ai.
// You can override baseUrl explicitly for testing if needed.
const client = createEzbotClient({
  timeoutMs: 500,
  // Optional: baseUrl: 'http://localhost:8000',
  // Optional: agentOptions for TLS/keepAlive tuning
  // agentOptions: { keepAlive: true }
});

async function fetchPredictions() {
  const params: PredictionsParams = {
    projectId: 123,
    pageUrlPath: '/',
    userAgent: '...',
    referrer: '...'
  };
  const meta: RequestMeta = {
    userAgent: params.userAgent,
    referrer: params.referrer,
    origin: 'https://your-site.example',
    headers: { 'accept-language': 'en-US' },
  };

  try {
    const predictions = await client.getPredictions(params, meta);
    return predictions; // Array<Prediction>
  } finally {
    // Only call dispose() if the client will no longer be reused.
    // For serverless (per-invocation) workflows, dispose to free sockets.
    // For long-lived servers, keep a singleton and DO NOT dispose on every request.
    // client.dispose();
  }
}
```

Note: The `baseUrl` defaults to `https://api.ezbot.ai`. Only override it for local/testing scenarios.

### Lifecycle guidance
- __Serverless (per-invocation):__ create the client inside the handler/invocation and call `dispose()` in a `finally` block to close the underlying agent.
- __Long-lived server (singleton):__ create one client at module scope and reuse it across requests. Do not call `dispose()` on each request; call it only at shutdown.

### Error handling
- The client returns an empty array on network errors or timeouts to allow SSR to render without blocking.

## Credits

`ezbot-ai/ezbot-javascript-sdk` is maintained by [ezbot](ezbot.ai) and many [constributors](https://github.com/ezbot-ai/javascript-sdk/graphs/contributors).

### First-party Code

First-party code is stored in the `src` directory, with the exception of the `vendor` subdirectory.

### Third-party Code

Third-party code is brought in via npm, with a full manifest available in the `package.json` file. 3rd party code is also present in the `src/vendor` directory. 

### Special Thanks

Special thanks to Snowplow Analytics, Ltd, for their [Browser Tracker](https://www.npmjs.com/package/@snowplow/browser-tracker) library and other open source contributions.
