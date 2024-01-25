# ezbot-javascript

The easiest way to interact with ezbot via JS (node and browser). For ease of use, our Javascript library wraps Snowplow's [Browser Tracker](https://www.npmjs.com/package/@snowplow/browser-tracker) (BSD-3 License).

## How to use

### How to use it in your project

```bash
npm install ezbot-javascript
```

```js
import {
  initEzbot,
  trackPageView,
  trackRewardEvent,
  startActivityTracking,
} from 'ezbot-javascript';

await initEzbot();
startActivityTracking();
trackPageView();
trackRewardEvent();
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
