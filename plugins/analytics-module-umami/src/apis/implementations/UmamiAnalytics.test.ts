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
    identityApi?: any,
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

    return UmamiAnalytics.fromConfig(mockConfigApi, {
      fetchApi: mockFetchApi,
      identityApi,
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  describe('captureEvent', () => {
    it('should send payload to umami', async () => {
      const umamiAnalytics = buildInstance();
      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should not send payload to umami when trackingId is not set', async () => {
      const umamiAnalytics = buildInstance({
        ...defaultUmamiConfig,
        trackingId: undefined,
      } as any);
      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should not send payload to umami when dataDomain is not set', async () => {
      const umamiAnalytics = buildInstance({
        ...defaultUmamiConfig,
        dataDomain: undefined,
      } as any);
      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should not send payload to umami when testMode is set', async () => {
      const umamiAnalytics = buildInstance({
        ...defaultUmamiConfig,
        testMode: true,
      } as any);
      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should not send payload to umami when umami.disabled is set', async () => {
      const umamiAnalytics = buildInstance();

      localStorage.setItem('umami.disabled', '1');
      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).not.toHaveBeenCalled();

      localStorage.removeItem('umami.disabled');
      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('includes payload.id when Backstage identity is available', async () => {
      const identityApi = {
        getBackstageIdentity: async () => ({
          userEntityRef: 'user:default/alice',
        }),
      };
      const umamiAnalytics = buildInstance(defaultUmamiConfig, identityApi);

      // allow async init to run
      await new Promise(r => setTimeout(r, 10));

      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // MockFetchApi calls mockFetch(url, init)
      const fetchInit = mockFetch.mock.calls[0][1];
      const body = JSON.parse(fetchInit.body as string);
      expect(body.payload.id).toBe('user:default/alice');
    });

    it('does not include payload.id when identityApi not provided', async () => {
      const umamiAnalytics = buildInstance();

      await new Promise(r => setTimeout(r, 10));
      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const fetchInit = mockFetch.mock.calls[0][1];
      const body = JSON.parse(fetchInit.body as string);
      expect(body.payload.id).toBeUndefined();
    });

    it('behavior when enableDistinctId is false (implementation currently ignores this flag)', async () => {
      const umamiConfig: JsonObject = {
        ...defaultUmamiConfig,
        enableDistinctId: false,
      };
      const identityApi = {
        getBackstageIdentity: async () => ({
          userEntityRef: 'user:default/alice',
        }),
      };
      const umamiAnalytics = buildInstance(umamiConfig, identityApi);

      // NOTE: current UmamiAnalytics implementation does not inspect enableDistinctId.
      // So when identityApi is provided, payload.id will still be set.
      await new Promise(r => setTimeout(r, 10));
      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const fetchInit = mockFetch.mock.calls[0][1];
      const body = JSON.parse(fetchInit.body as string);
      expect(body.payload.id).toBe('user:default/alice');
    });

    it('sets payload.name for non-navigate actions', async () => {
      const umamiAnalytics = buildInstance();
      await umamiAnalytics.captureEvent(mockEvent);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const fetchInit = mockFetch.mock.calls[0][1];
      const body = JSON.parse(fetchInit.body as string);
      // non-navigate event => name should be subject-action
      expect(body.payload.name).toBe(
        `${mockEvent.subject}-${mockEvent.action}`,
      );
    });

    it('does not set payload.name for navigate action', async () => {
      const navEvent: AnalyticsEvent = {
        ...mockEvent,
        action: 'navigate',
      };
      const umamiAnalytics = buildInstance();
      await umamiAnalytics.captureEvent(navEvent);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const fetchInit = mockFetch.mock.calls[0][1];
      const body = JSON.parse(fetchInit.body as string);
      expect(body.payload.name).toBeUndefined();
    });
  });
});
