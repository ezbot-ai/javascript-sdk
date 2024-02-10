/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-immutable-types */
/*
 * This package uses source code from Snowplow Analytics Ltd
 * Copyright (c) 2022 Snowplow Analytics Ltd, 2010 Anthon Pang
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/* eslint-disable functional/no-return-void */
import { BrowserFeaturesPlugin } from '@snowplow/browser-plugin-browser-features';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { ConsentPlugin } from '@snowplow/browser-plugin-consent';
import { EcommercePlugin } from '@snowplow/browser-plugin-ecommerce';
import { FormTrackingPlugin } from '@snowplow/browser-plugin-form-tracking';
import { GaCookiesPlugin } from '@snowplow/browser-plugin-ga-cookies';
import { GeolocationPlugin } from '@snowplow/browser-plugin-geolocation';
import { LinkClickTrackingPlugin } from '@snowplow/browser-plugin-link-click-tracking';
import { SiteTrackingPlugin } from '@snowplow/browser-plugin-site-tracking';
import { TimezonePlugin } from '@snowplow/browser-plugin-timezone';
import {
  addGlobalContexts,
  BrowserTracker,
  CommonEventProperties,
  enableActivityTracking,
  newTracker,
  trackPageView as tPageView,
  trackSelfDescribingEvent,
} from '@snowplow/browser-tracker';
import {
  ActivityTrackingConfiguration,
  PageViewEvent,
  TrackerConfiguration,
} from '@snowplow/browser-tracker-core';

const plugins = [
  GaCookiesPlugin(),
  GeolocationPlugin(),
  ClientHintsPlugin(),
  ConsentPlugin(),
  LinkClickTrackingPlugin(),
  FormTrackingPlugin(),
  TimezonePlugin(),
  EcommercePlugin(),
  SiteTrackingPlugin(),
  BrowserFeaturesPlugin(),
];
const EzbotTrackerDomain = 'https://api.ezbot.ai';
const EzbotRewardEventSchema = 'iglu:com.ezbot/reward_event/jsonschema/1-0-0';
const EzbotLinkClickEventSchema = 'iglu:com.ezbot/link_click/jsonschema/1-0-0';
const EzbotPredictionsContextSchema =
  'iglu:com.ezbot/predictions_context/jsonschema/1-0-1';
const DefaultWebConfiguration: TrackerConfiguration = {
  appId: 'default-ezbot-app-id',
  encodeBase64: true,
  cookieName: '_ezbot_',
  plugins: plugins,
};

declare global {
  interface Window {
    ezbot: {
      tracker: BrowserTracker;
      predictions: Array<Prediction>;
      sessionId: string;
      trackPageView: (event?: PageViewEvent & CommonEventProperties) => void;
      trackRewardEvent: (payload: Readonly<EzbotRewardEventPayload>) => void;
      startActivityTracking: (config: ActivityTrackingConfiguration) => void;
      makeVisualChanges: () => void;
    };
  }
}

type VariableConfig = {
  selector: string;
  action: string;
};

type Prediction = {
  key: string;
  type: string;
  version: string;
  value: string;
  config: VariableConfig;
};

type Predictions = {
  predictions: Array<Prediction>;
};

type PredictionsResponse = {
  holdback: boolean;
  predictions: Array<Prediction>;
};

type EzbotRewardEvent = {
  schema: string;
  data: EzbotRewardEventPayload;
};

type EzbotRewardEventPayload = {
  key: string;
  reward?: number | null;
  rewardUnits?: string | null;
  category?: string | null;
};

type EzbotLinkClickEvent = {
  schema: string;
  data: EzbotLinkClickEventPayload;
};

type EzbotLinkClickEventPayload = {
  text?: string | null;
  href?: string | null;
  selector: string;
};

type EzbotPredictionsContext = {
  schema: string;
  data: Predictions;
};

const ezbotTrackerId = 'ezbot';
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

async function initEzbot(
  projectId: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: TrackerConfiguration = DefaultWebConfiguration
): Promise<BrowserTracker> {
  const existingTracker = window.ezbot?.tracker;
  if (existingTracker) {
    return existingTracker;
  }
  const tracker = newTracker(ezbotTrackerId, EzbotTrackerDomain, {
    appId: projectId.toString(),
    plugins: plugins,
  });
  if (tracker === null) {
    throw new Error('Failed to initialize tracker');
  }

  const domainUserInfo = tracker.getDomainUserInfo() as unknown;
  const sessionId = (domainUserInfo as string[])[6];
  const predictions = await getPredictions(projectId, sessionId);
  const predictionsContext: EzbotPredictionsContext = {
    schema: EzbotPredictionsContextSchema,
    data: { predictions: predictions },
  };
  addGlobalContexts([predictionsContext], [tracker.id]);

  window.ezbot = {
    tracker: tracker,
    predictions: predictions,
    sessionId: sessionId,
    trackPageView: tracker.trackPageView, // only send to ezbot tracker
    trackRewardEvent: trackRewardEvent,
    startActivityTracking: startActivityTracking,
    makeVisualChanges: makeVisualChanges,
  };

  return tracker;
}

function trackRewardEvent(payload: Readonly<EzbotRewardEventPayload>): void {
  const event: EzbotRewardEvent = {
    schema: EzbotRewardEventSchema,
    data: payload,
  };
  trackSelfDescribingEvent(
    { event: event },
    [ezbotTrackerId] // only send to ezbot tracker
  );
}

function trackLinkClick(payload: Readonly<EzbotLinkClickEventPayload>): void {
  const event: EzbotLinkClickEvent = {
    schema: EzbotLinkClickEventSchema,
    data: payload,
  };
  trackSelfDescribingEvent(
    {
      event: event,
    },
    [ezbotTrackerId] // only send to ezbot tracker
  );
}

function startActivityTracking(config: ActivityTrackingConfiguration): void {
  enableActivityTracking(config, [ezbotTrackerId]); // only send to ezbot tracker
}

function trackPageView(
  config: Readonly<PageViewEvent & CommonEventProperties>
): void {
  tPageView(config);
}

function setElementText(element: Element, text: string): void {
  element.textContent = text;
}

function setElementInnerHTML(element: HTMLElement, innerHTML: string): void {
  element.innerHTML = innerHTML;
}

function addElementAttributes(
  element: HTMLElement,
  attributes: Record<string, string>
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function removeElementAttributes(
  element: HTMLElement,
  attributes: Array<string>
): void {
  attributes.forEach((attribute) => {
    element.removeAttribute(attribute);
  });
}
function setElementAttribute(
  element: HTMLElement,
  attribute: string,
  value: string
) {
  element.setAttribute(attribute, value);
}

function addElementClasses(element: HTMLElement, classes: Array<string>): void {
  element.classList.add(...classes);
}

function removeElementClasses(
  element: HTMLElement,
  classes: Array<string>
): void {
  element.classList.remove(...classes);
}

function setElementHref(element: HTMLAnchorElement, href: string): void {
  setElementAttribute(element, 'href', href);
}

function hideElement(element: HTMLElement): void {
  element.style.display = 'none';
  element.style.visibility = 'hidden';
}
function showElement(element: HTMLElement): void {
  element.style.display = 'block';
  element.style.visibility = 'visible';
}

function validateVisualPrediction(prediction: Prediction): string | null {
  if (prediction.config == null) {
    return `No config found for prediction with key: ${prediction.key}. Skipping its visual change.`;
  }
  if (!prediction.config.selector) {
    return `No selector found for prediction with key: ${prediction.key}. Skipping its visual change.`;
  }
  if (!prediction.config.action) {
    return `No action found for prediction with key: ${prediction.key}. Skipping its visual change.`;
  }

  return null;
}

function makeVisualChange(prediction: Prediction): void {
  const element = document.querySelector(prediction.config.selector);
  if (!element) {
    console.log(
      `No element found for prediction with key: ${prediction.key}. Skipping its visual change.`
    );
  }
  const action = prediction.config.action;
  if (action === 'setText') {
    setElementText(element, prediction.value);
  }
  if (action === 'setInnerHTML') {
    setElementInnerHTML(element, prediction.value);
  }
  if (action === 'addAttributes') {
    addElementAttributes(element, prediction.value);
  } else {
    console.log(
      `Unsupported action for prediction with key: ${prediction.key}. Skipping its visual change.`
    );
  }
}

function makeVisualChanges(): void {
  const predictions = window.ezbot?.predictions;
  if (!predictions) {
    console.log('No predictions found. Skipping visual changes.');
    return;
  }
  predictions.forEach((prediction) => {
    if (prediction.type != 'visual') {
      return;
    }

    const validationError = validateVisualPrediction(prediction);
    if (validationError != null) {
      console.log(validationError);
      return;
    }

    makeVisualChange(prediction);
  });
}

export {
  trackRewardEvent,
  initEzbot,
  makeVisualChange,
  makeVisualChanges,
  startActivityTracking,
  trackLinkClick,
  trackPageView,
  setElementText,
  setElementInnerHTML,
  addElementAttributes,
  removeElementAttributes,
  setElementAttribute,
  addElementClasses,
  removeElementClasses,
  setElementHref,
  hideElement,
  showElement,
  EzbotLinkClickEvent,
  EzbotRewardEvent,
  EzbotLinkClickEventPayload,
  EzbotRewardEventPayload,
  EzbotPredictionsContext,
  Prediction,
  Predictions,
  PredictionsResponse,
};
