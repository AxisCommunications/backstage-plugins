import { mockApis, MockFetchApi } from '@backstage/test-utils';
import { AnalyticsEvent } from '@backstage/core-plugin-api';
import { UmamiAnalytics } from './UmamiAnalytics';
import { JsonObject } from '@backstage/types';

describe('UmamiAnalytics', () => {
  const defaultUmamiConfig = {
    trackingId: '25b1d354-86c8-4470-a76a-8823bd4e82d5',
    dataDomain: 'https://cloud.umami.is',
  };
  const mockEvent: AnalyticsEvent = {
    action: 'view',
    subject: '/catalog/default/component/backstage',
    context: {
      pluginId: 'catalog',
      routeRef: 'catalog:entity',
      extension: 'CatalogEntityPage',
    },
  };
  const mockFetch = jest.fn();

  const buildInstance = (
    umamiConfig: JsonObject = defaultUmamiConfig,
  ): UmamiAnalytics => {
    const fullConfig = {
      app: {
        analytics: {
          umami: umamiConfig,
        },
      },
    };
    const mockConfigApi = mockApis.config({ data: fullConfig });
    const mockFetchApi = new MockFetchApi({ baseImplementation: mockFetch });

    return UmamiAnalytics.fromConfig(mockConfigApi, { fetchApi: mockFetchApi });
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('captureEvent', () => {
    it('should send payload to umami', () => {
      const umamiAnalytics = buildInstance();
      umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should not send payload to umami when trackingId is not set', () => {
      const umamiAnalytics = buildInstance({
        ...defaultUmamiConfig,
        trackingId: undefined,
      });
      umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should not send payload to umami when dataDomain is not set', () => {
      const umamiAnalytics = buildInstance({
        ...defaultUmamiConfig,
        dataDomain: undefined,
      });
      umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should not send payload to umami when testMode is set', () => {
      const umamiAnalytics = buildInstance({
        ...defaultUmamiConfig,
        testMode: true,
      });
      umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should not send payload to umami when umami.disabled is set', () => {
      const umamiAnalytics = buildInstance();

      localStorage.setItem('umami.disabled', '1');
      umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).not.toHaveBeenCalled();

      localStorage.removeItem('umami.disabled');
      umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
