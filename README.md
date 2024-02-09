# ezbot-javascript

The easiest way to interact with ezbot via JS (node and browser). For ease of use, our Javascript library wraps Snowplow's [Browser Tracker](https://www.npmjs.com/package/@snowplow/browser-tracker) (BSD-3 License).

## Getting Started

### How to use it in your project via NPM (recommended)

Install

```bash
npm install @ezbot-ai/javascript-sdk
```

Use

```js
import { initEzbot } from '@ezbot-ai/javascript-sdk';

await initEzbot(yourProjectId, { appId: yourAppId });
```

### How to use it in your project via `<script>` tag

Install

```html
<script src="https://cdn.ezbot.ai/web-snippets/ezbot.min.js">
```

Use

```js
await ezbot.initEzbot(yourProjectId, { appId: yourAppId });
```

### How to develop this library

```bash
npm install
npm run fix
npm run test:unit
```

## Sending Events

Send reward events to ezbot to tune the model and improve the quality of the recommendations.

We currently support two types of rewardUnits: `count` and `dollars`. If you send a reward with `dollars` as the rewardUnits, we will use it to calculate the total dollars per session. If you send a reward with `count` as the rewardUnits, we will optimize for total _count_ of reward events per session.

We only support one type of `rewardUnits` in projects today.

### Via NPM

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
  minimumVisitLength: 2,
  /** The interval at which the callback will be fired */
  heartbeatDelay: 2,
});
trackPageView();
trackRewardEvent({ key: 'your_key', reward: 1, rewardUnits: 'count' });
trackRewardEvent({ key: 'another_key', reward: 100, rewardUnits: 'dollars' });
```

### Via `<script>` tag

```js
await ezbot.initEzbot(yourProjectId, { appId: yourAppId });
ezbot.startActivityTracking({
  /** The minimum time that must have elapsed before first heartbeat */
  minimumVisitLength: 2,
  /** The interval at which the callback will be fired */
  heartbeatDelay: 2,
});
ezbot.trackPageView();
ezbot.trackRewardEvent({ key: 'your_key', reward: 1, rewardUnits: 'count' });
ezbot.trackRewardEvent({
  key: 'another_key',
  reward: 100,
  rewardUnits: 'dollars',
});
```

### NextJS

Since we don't yet support server-side rendering, you'll need to notate your component with `"use strict"` and use the React Hook `useEffect` to initialize ezbot. If you're using Strict Mode, you'll need to use a ref to prevent multiple initializations in your development environment. Strict Mode does not affect production.

```js
'use client';

import { initEzbot } from '@ezbot-ai/javascript-sdk';
import { useEffect, useRef } from 'react';

// your component
export default function Home() {
  const ezbotInit = useRef(false);
  useEffect(() => {
    if (ezbotInit.current) {
      return;
    }
    initEzbot(7);
    ezbotInit.current = true;
  }, []);
}
```

## Using Predictions

Change your user's experience based on the predictions made by ezbot. For now, you'll need to write custom code to use the predictions.

Below is just an example. After initializing ezbot, you can use the `window.ezbot.predictions` object to access the predictions.

### Example Text Replacement Via NPM

```js
function replaceTextWithPredictions(predictions) {
  try {
    if (!predictions) {
      console.log('no predictions, skipping text replacement');
      return;
    }
    const heroHeadlineKeyFound = predictions.find(
      (e) => e.variable === heroHeadlineKey
    );
    if (heroHeadlineKeyFound) {
      const heroHeadlineValue = heroHeadlineKeyFound.value;
      console.log(
        `Predictions has key "${heroHeadlineKey}". Setting headline to "${heroHeadlineValue}"`
      );
      $(`#${heroHeadlineId}`).text(heroHeadlineValue);
    } else {
      console.log(
        `No key "${heroHeadlineKey}" in predictions. Skipping replacement.`
      );
    }

    const heroCTAKeyFound = predictions.find((e) => e.variable === heroCTAKey);
    if (heroCTAKeyFound) {
      const heroCTAValue = heroCTAKeyFound.value;
      console.log(
        `Predictions has key "${heroCTAKey}". Setting cta to "${heroCTAValue}"`
      );
      $(`#${heroCTAId}`).text(heroCTAValue);
    } else {
      console.log(
        `No key "${heroCTAKey}" in predictions. Skipping replacement.`
      );
    }
  } catch (e) {
    console.error('Error replacing text with predictions', e);
  }
}
replaceTextWithPredictions(window.ezbot.predictions);
```

## Credits

`ezbot/ezbot-javascript` is maintained by [ezbot](ezbot.ai) and many [constributors](https://github.com/ezbot/ezbot-javascript/graphs/contributors).

### First-party Code

First-party code is stored in the `src` directory.

### Third-party Code

Third-party code is brought in via npm, with a full manifest available in the `package.json` file.

### Special Thanks

Special thanks to Snowplow Analytics, Ltd, for their [Browser Tracker](https://www.npmjs.com/package/@snowplow/browser-tracker) library and other open source contributions.
