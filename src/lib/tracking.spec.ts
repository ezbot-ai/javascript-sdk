/* eslint-disable functional/no-return-void */
import {
  enableActivityTracking,
  trackPageView,
  trackSelfDescribingEvent,
} from '@snowplow/browser-tracker';
import { CommonEventProperties, PageViewEvent } from '@snowplow/tracker-core';

import {
  startActivityTracking,
  trackPageView as tPageView,
  trackLinkClick,
  trackRewardEvent,
} from './tracking';
jest.mock('@snowplow/browser-tracker');

describe('tracking', () => {
  describe('trackRewardEvent', () => {
    it('should call trackSelfDescribingEvent with the correct payload', () => {
      const payload = {
        key: 'some_key',
        reward: 100,
      };
      trackRewardEvent(payload);
      expect(trackSelfDescribingEvent).toHaveBeenCalledWith(
        {
          event: {
            schema: 'iglu:com.ezbot/reward_event/jsonschema/1-0-0',
            data: payload,
          },
        },
        ['ezbot']
      );
    });
  });
  describe('trackLinkClick', () => {
    it('should call trackSelfDescribingEvent with the correct payload', () => {
      const payload = {
        selector: 'some_selector',
        linkId: 'some_link_id',
      };
      trackLinkClick(payload);
      expect(trackSelfDescribingEvent).toHaveBeenCalledWith(
        {
          event: {
            schema: 'iglu:com.ezbot/link_click/jsonschema/1-0-0',
            data: payload,
          },
        },
        ['ezbot']
      );
    });
  });
  describe('startActivityTracking', () => {
    it('should call enableActivityTracking with the correct config', () => {
      const config = {
        minimumVisitLength: 10,
        heartbeatDelay: 10,
      };
      startActivityTracking(config);
      expect(enableActivityTracking).toHaveBeenCalledWith(config, ['ezbot']);
    });
  });
  describe('trackPageView', () => {
    it('should call trackPageView with the correct config', () => {
      const config: Readonly<
        PageViewEvent & CommonEventProperties<Record<string, unknown>>
      > = {
        pageUrl: 'some_url',
        pageTitle: 'some_title',
        referrer: 'some_referrer',
      };
      tPageView(config);
      expect(trackPageView).toHaveBeenCalledWith(config);
    });
  });
});
