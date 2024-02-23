/* eslint-disable functional/no-return-void */
const mockTrackPageView = jest.fn();
const mockEnableActivityTracking = jest.fn();
const mockTrackSelfDescribingEvent = jest.fn();

import { CommonEventProperties, PageViewEvent } from '@snowplow/tracker-core';

import {
  startActivityTracking,
  trackLinkClick,
  trackPageView,
  trackRewardEvent,
} from './tracking';

describe('tracking', () => {
  beforeAll(() => {
    jest.mock('@snowplow/browser-tracker', () => ({
      enableActivityTracking: mockEnableActivityTracking,
      trackPageView: mockTrackPageView,
      trackSelfDescribingEvent: mockTrackSelfDescribingEvent,
    }));
  });
  describe('trackRewardEvent', () => {
    it('should call trackSelfDescribingEvent with the correct payload', () => {
      const payload = {
        key: 'some_key',
        reward: 100,
      };
      trackRewardEvent(payload);
      expect(mockTrackSelfDescribingEvent).toHaveBeenCalledWith(
        {
          event: {
            schema: 'iglu:com.example/reward/jsonschema/1-0-0',
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
      expect(mockTrackSelfDescribingEvent).toHaveBeenCalledWith(
        {
          event: {
            schema: 'iglu:com.example/link_click/jsonschema/1-0-0',
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
      expect(mockEnableActivityTracking).toHaveBeenCalledWith(config, [
        'ezbot',
      ]);
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
      trackPageView(config);
      expect(mockTrackPageView).toHaveBeenCalledWith(config);
    });
  });
});
