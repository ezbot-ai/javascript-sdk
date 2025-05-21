/* eslint-disable functional/immutable-data */

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

import { enableButtonClickTracking } from '@snowplow/browser-plugin-button-click-tracking';
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';
import {
  addGlobalContexts,
  BrowserTracker,
  ExtendedCrossDomainLinkerOptions,
  newTracker,
  TrackerConfiguration,
} from '@snowplow/browser-tracker';

import {
  defaultWebConfiguration,
  ezbotPredictionsContextSchemaPath,
  ezbotTrackerDomain,
  plugins,
} from './constants';
import { getPredictions } from './predictions';
import {
  setUserId,
  setUserIdFromCookie,
  startActivityTracking,
  trackLinkClick,
  trackPageView,
  trackRewardEvent,
} from './tracking';
import {
  EzbotLinkClickEvent,
  EzbotLinkClickEventPayload,
  EzbotPredictionsContext,
  EzbotRewardEvent,
  EzbotRewardEventPayload,
  EzbotTrackerConfig,
  Prediction,
  Predictions,
  PredictionsResponse,
} from './types';
import { createCrossDomainLinkChecker } from './utils/crossDomainLinker';
import {
  makeVisualChange,
  makeVisualChanges,
  visualChanges,
  visualUtils,
} from './visualChanges';

const ezbotTrackerId = 'ezbot';

async function initEzbot(
  projectId: number,
  userId?: string | null,
  _config: EzbotTrackerConfig = defaultWebConfiguration as EzbotTrackerConfig
): Promise<BrowserTracker> {
  const existingTracker = window.ezbot?.tracker;
  if (existingTracker && userId) {
    existingTracker.setUserId(userId);
    return existingTracker;
  }

  // Prepare tracker configuration
  const trackerConfig: TrackerConfiguration = {
    appId: projectId.toString(),
    plugins: plugins,
    stateStorageStrategy: 'localStorage',
    discoverRootDomain: true,
  };

  // Handle cross-domain tracking if enabled
  if (_config?.crossDomain?.enabled) {
    if (!_config?.crossDomain.domains.length) {
      throw new Error('Cross-domain tracking enabled but no domains provided');
    }

    const extendedCrossDomainLinkerOptions: ExtendedCrossDomainLinkerOptions = {
      userId: true,
      sessionId: true,
    };
    trackerConfig.useExtendedCrossDomainLinker =
      extendedCrossDomainLinkerOptions;
    const crossDomainLinkerFunction = createCrossDomainLinkChecker(
      _config.crossDomain.domains
    );
    trackerConfig.crossDomainLinker = crossDomainLinkerFunction;
  }

  const tracker = newTracker(ezbotTrackerId, ezbotTrackerDomain, trackerConfig);
  if (!tracker) {
    throw new Error('Failed to initialize tracker');
  }

  if (userId) {
    tracker.setUserId(userId);
  }

  tracker.setUserIdFromReferrer('_sp');

  const domainUserInfo = tracker.getDomainUserInfo() as unknown;

  const sessionId: string = (domainUserInfo as string[])[6];

  // TODO: this should happen automatically somehow
  // if (window.location.href.includes('_sp=')) {
  //   // get sessionId for cross-domain linking
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const snowPlowParams = urlParams.get('_sp');
  //   if (snowPlowParams != null) {
  //     sessionId = snowPlowParams.split('.')[2];
  //   }
  // }

  // eslint-disable-next-line functional/no-let
  let predictions: Array<Prediction> = [];
  try {
    predictions = await getPredictions(projectId, sessionId, tracker);
  } catch (error) {
    console.error('Failed to get predictions', error);
  }
  const predictionsContext: EzbotPredictionsContext = {
    schema: ezbotPredictionsContextSchemaPath,
    data: {
      predictions: predictions.map((pred) => ({
        variable: pred.key,
        value: pred.value,
      })),
    },
  };
  addGlobalContexts([predictionsContext], [tracker.id]);

  window.ezbot = {
    trackerConfig: trackerConfig,
    userId: userId,
    tracker: tracker,
    predictions: predictions,
    sessionId: sessionId,
    trackPageView: trackPageView, // only send to ezbot tracker
    trackRewardEvent: trackRewardEvent,
    startActivityTracking: startActivityTracking,
    makeVisualChanges: makeVisualChanges,
    setUserId: setUserId,
    setUserIdFromCookie: setUserIdFromCookie,
    utils: {
      visual: visualUtils,
    },
    actions: {
      visual: visualChanges,
    },
    intervals: [],
    mode: 'ezbot',
  };
  try {
    enableLinkClickTracking();
    enableButtonClickTracking();
  } catch (error) {
    console.error('Failed to enable click tracking', error);
  }

  return tracker;
}

export {
  trackRewardEvent,
  initEzbot,
  makeVisualChange,
  makeVisualChanges,
  startActivityTracking,
  trackLinkClick,
  trackPageView,
  setUserId,
  setUserIdFromCookie,
  EzbotLinkClickEvent,
  EzbotRewardEvent,
  EzbotLinkClickEventPayload,
  EzbotRewardEventPayload,
  EzbotPredictionsContext,
  Prediction,
  Predictions,
  PredictionsResponse,
};
