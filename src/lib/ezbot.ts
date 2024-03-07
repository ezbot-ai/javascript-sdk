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

import {
  addGlobalContexts,
  BrowserTracker,
  newTracker,
} from '@snowplow/browser-tracker';
import { TrackerConfiguration } from '@snowplow/browser-tracker-core';

import {
  defaultWebConfiguration,
  ezbotPredictionsContextSchemaPath,
  ezbotTrackerDomain,
  plugins,
} from './constants';
import { getPredictions } from './predictions';
import {
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
  Prediction,
  Predictions,
  PredictionsResponse,
} from './types';
import { VisualEditorController } from './visual-editor';
import { init as initVisualEditorSupport } from './visual-editor/actions';
import { makeVisualChange, makeVisualChanges } from './visualChanges';

const ezbotTrackerId = 'ezbot';

async function initEzbot(
  projectId: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: TrackerConfiguration = defaultWebConfiguration
): Promise<BrowserTracker> {
  const existingTracker = window.ezbot?.tracker;
  if (existingTracker) {
    return existingTracker;
  }
  const tracker = newTracker(ezbotTrackerId, ezbotTrackerDomain, {
    appId: projectId.toString(),
    plugins: plugins,
  });
  if (tracker === null) {
    throw new Error('Failed to initialize tracker');
  }

  const domainUserInfo = tracker.getDomainUserInfo() as unknown;
  const sessionId: string = (domainUserInfo as string[])[6];
  const predictions: Array<Prediction> = await getPredictions(
    projectId,
    sessionId
  );
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

  try {
    VisualEditorController.mutators.setupListeners();
  } catch (error) {
    console.error('Failed to setup element click listeners', error);
  }

  window.ezbot = {
    tracker: tracker,
    predictions: predictions,
    sessionId: sessionId,
    trackPageView: trackPageView, // only send to ezbot tracker
    trackRewardEvent: trackRewardEvent,
    startActivityTracking: startActivityTracking,
    makeVisualChanges: makeVisualChanges,
  };
  initVisualEditorSupport('ezbot');

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
  EzbotLinkClickEvent,
  EzbotRewardEvent,
  EzbotLinkClickEventPayload,
  EzbotRewardEventPayload,
  EzbotPredictionsContext,
  Prediction,
  Predictions,
  PredictionsResponse,
};
