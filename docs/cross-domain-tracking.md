# Cross-Domain Tracking with ezbot

This guide explains how to implement cross-domain session tracking with ezbot, allowing you to maintain user sessions and track conversions across multiple domains.

## Overview

Cross-domain tracking enables you to track user journeys that span multiple domains in your ecosystem. When a user navigates from one domain to another, ezbot can maintain the same session ID, allowing you to:

- Track user journeys across multiple domains
- Attribute conversions to the correct session
- Provide consistent user experiences across domains

## Implementation

### Prerequisites

- ezbot JavaScript SDK installed on all domains that require tracking
- Admin access to modify all websites involved

### Step 1: Install ezbot on both domains

Install the ezbot JavaScript SDK on all domains that require tracking. You can use either the snippet method or direct SDK import.

#### Snippet Installation

```html
<script>
  // Your ezbot snippet here
</script>
```

#### SDK Installation

```bash
npm install @ezbot/javascript-sdk
```

```javascript
import { initEzbot } from '@ezbot/javascript-sdk';
```

### Step 2: Configure Primary Domain

On your primary domain (where user journeys typically start), initialize ezbot with cross-domain tracking enabled:

```javascript
const tracker = await initEzbot(
  YOUR_PROJECT_ID,
  null, // or user ID if available
  {
    crossDomain: {
      enabled: true,
      domains: ['seconddomain.com', 'thirddomain.com'], // List all domains to link
      linkQueryParameterName: '_ezbot_' // Optional, defaults to '_ezbot_'
    }
  }
);

// The session ID will be automatically generated and links to other domains will be decorated
const sessionId = window.ezbot.sessionId;
```

### Step 3: Link from Primary to Secondary Domains

When creating links to your secondary domains, they will be automatically decorated with the ezbot session ID parameter. You don't need to modify your links manually as ezbot will handle this for you.

For example, a link like:
```html
<a href="https://seconddomain.com/page">Go to second domain</a>
```

Will be transformed to:
```html
<a href="https://seconddomain.com/page?_ezbot_=12345abcde">Go to second domain</a>
```

### Step 4: Configure Secondary Domains

On your secondary domains, initialize ezbot with cross-domain tracking enabled:

```javascript
const tracker = await initEzbot(
  YOUR_PROJECT_ID,
  null, // or user ID if available
  {
    crossDomain: {
      enabled: true,
      domains: ['primarydomain.com', 'thirddomain.com'], // List all domains to link
      // No need to specify sessionId, it will be automatically extracted from URL
    }
  }
);

// The session ID will be retrieved from the URL and set in the tracker
console.log("Using session ID:", window.ezbot.sessionId);
```

### Step 5: Track Conversions

You can track reward/conversion events from any of the domains. The events will be correctly associated with the cross-domain session:

```javascript
// Track a conversion event
window.ezbot.trackRewardEvent({
  key: 'purchase',
  reward: 100,
  rewardUnits: 'USD',
  category: 'ecommerce'
});
```

## Advanced Configuration

### Manual Session ID Passing

If you prefer to explicitly pass the session ID between domains (for example, in a server-side rendering context), you can do so by:

1. Getting the session ID on the primary domain:
   ```javascript
   const sessionId = window.ezbot.sessionId;
   ```

2. Passing it to the secondary domain through the URL:
   ```html
   <a href="https://seconddomain.com/page?_ezbot_=${sessionId}">Go to second domain</a>
   ```

3. Initializing ezbot on the secondary domain with the session ID:
   ```javascript
   // Get the session ID from URL parameter
   const urlParams = new URLSearchParams(window.location.search);
   const sessionId = urlParams.get('_ezbot_');

   const tracker = await initEzbot(
     YOUR_PROJECT_ID,
     null,
     {
       crossDomain: {
         enabled: true,
         sessionId: sessionId // Explicitly pass the session ID
       }
     }
   );
   ```

### Customizing Query Parameter Name

You can customize the query parameter name used for cross-domain linking:

```javascript
const tracker = await initEzbot(
  YOUR_PROJECT_ID,
  null,
  {
    crossDomain: {
      enabled: true,
      domains: ['seconddomain.com'],
      linkQueryParameterName: 'my_session' // Custom parameter name
    }
  }
);
```

## Troubleshooting

### Session Not Linking

If sessions are not linking properly:

1. Verify that `crossDomain.enabled` is set to `true` on all domains.
2. Check that the domain names in the `domains` array match exactly with the domains you're using.
3. Ensure the query parameter (`_ezbot_` by default) is being passed correctly between domains.
4. Check browser console for any errors.

### Testing Cross-Domain Sessions

To test if cross-domain tracking is working:

1. Open the primary domain in your browser
2. Check the browser console to get the session ID: `console.log(window.ezbot.sessionId)`
3. Click a link to the secondary domain
4. On the secondary domain, check if the session ID matches: `console.log(window.ezbot.sessionId)`

## Technical Details

Under the hood, ezbot uses Snowplow's cross-domain tracking capabilities to maintain consistent sessions. The implementation follows Snowplow's recommended practices:

- URL decoration for passing session information
- Preserving first-party cookies where possible
- Local storage for persistent session data

## References

For more information, see:

- [Snowplow Cross-Domain Tracking Documentation](https://docs.snowplow.io/docs/sources/trackers/javascript-trackers/web-tracker/cross-domain-tracking/)
- [Snowplow JavaScript Tracker Initialization Options](https://docs.snowplow.io/docs/sources/trackers/javascript-trackers/web-tracker/tracker-setup/initialization-options/)
