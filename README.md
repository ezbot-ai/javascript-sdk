# ezbot-javascript

The easiest way to interact with ezbot via JS (node and browser). For ease of use, our Javascript library wraps Snowplow's [Browser Tracker](https://www.npmjs.com/package/@snowplow/browser-tracker) (BSD-3 License).

## How to use

### How to use it in your project via NPM

```bash
npm install @ezbot-ai/javascript-sdk
```

```js
import {
  initEzbot,
  trackPageView,
  trackRewardEvent,
  startActivityTracking,
} from '@ezbot-ai/javascript-sdk';

await initEzbot(yourProjectId, { appId: yourAppId });
startActivityTracking({
    /** The minimum time that must have elapsed before first heartbeat */
    minimumVisitLength: 2;
    /** The interval at which the callback will be fired */
    heartbeatDelay: 2;
});
trackPageView();
trackRewardEvent({ key: 'your_key', reward: 1, rewardUnits: 'count' });
trackRewardEvent({ key: 'another_key', reward: 100, rewardUnits: 'dollars' });
```

### How to use it in your project via `<script>` tag

```html
<script src="https://cdn.ezbot.ai/web-snippets/ezbot.min.js">
```

```js
await ezbot.initEzbot(yourProjectId, { appId: yourAppId });
ezbot.startActivityTracking({
    /** The minimum time that must have elapsed before first heartbeat */
    minimumVisitLength: 2;
    /** The interval at which the callback will be fired */
    heartbeatDelay: 2;
});
ezbot.trackRewardEvent({ key: 'your_key', reward: 1, rewardUnits: 'count' });
ezbot.trackRewardEvent({ key: 'another_key', reward: 100, rewardUnits: 'dollars' });
```

### How to develop this library

```bash
npm install
npm run fix
npm run test:unit
```

## Credits

`ezbot/ezbot-javascript` is maintained by [ezbot](ezbot.ai) and many [constributors](https://github.com/ezbot/ezbot-javascript/graphs/contributors).

### First-party Code

First-party code is stored in the `src` directory.

### Third-party Code

Third-party code is brought in via npm, with a full manifest available in the `package.json` file.

### Special Thanks

Special thanks to Snowplow Analytics, Ltd, for their [Browser Tracker](https://www.npmjs.com/package/@snowplow/browser-tracker) library and other open source contributions.
