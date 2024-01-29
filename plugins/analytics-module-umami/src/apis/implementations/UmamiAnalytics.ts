import {
  AnalyticsApi,
  AnalyticsEvent,
  AnalyticsEventAttributes,
  FetchApi,
} from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';

interface IPayload {
  payload: {
    hostname: string;
    language: string;
    referrer: string;
    screen: string;
    title: string;
    url: string;
    website: string;
    name?: string;
    data: AnalyticsEventAttributes | undefined;
  };
  type: string;
}

/**
 * Umami Analytics API provider for the Backstage Analytics API.
 * @public
 */
export class UmamiAnalytics implements AnalyticsApi {
  private readonly fetchApi: FetchApi;
  private dataDomain: string;
  private trackingId: string;
  private debug: boolean;
  private testMode: boolean;

  /**
   * Instantiate the implementation and initialize Umami.
   */
  private constructor(options: {
    fetchApi: FetchApi;
    trackingId: string;
    dataDomain: string;
    debug?: boolean;
    testMode?: boolean;
  }) {
    const { fetchApi, trackingId, dataDomain, debug, testMode } = options;
    this.fetchApi = fetchApi;
    this.dataDomain = dataDomain;
    this.trackingId = trackingId;
    this.testMode = testMode || false;
    this.debug = debug || false;
  }

  /**
   * Instantiate a fully configured Umami Analytics API implementation.
   */
  static fromConfig(
    config: Config,
    options: {
      fetchApi: FetchApi;
    },
  ) {
    const { fetchApi } = options;

    const trackingId =
      config.getOptionalString('app.analytics.umami.trackingId') || '';
    const dataDomain =
      config.getOptionalString('app.analytics.umami.dataDomain') || '';
    const debug = config.getOptionalBoolean('app.analytics.umami.debug');
    const testMode = config.getOptionalBoolean('app.analytics.umami.testMode');

    return new UmamiAnalytics({
      fetchApi,
      trackingId,
      dataDomain,
      debug,
      testMode,
    });
  }

  /**
   * Primary event capture implementation. Handles core navigate event as a
   * pageview and the rest as custom events. All custom dimensions/metrics are
   * applied as they should be (set on pageview, merged object on events).
   */
  async captureEvent(event: AnalyticsEvent) {
    const NAME_PROPS = 'name';
    // No configuration is set. Do nothing.
    if (!this.trackingId || !this.dataDomain) {
      return;
    }
    const {
      screen: { width, height },
      navigator: { language },
    } = window;
    const { hostname } = location;
    const { context, subject, action, attributes } = event;

    const payload: IPayload = {
      payload: {
        hostname,
        language,
        referrer: '',
        screen: `${width}x${height}`,
        title: context.pluginId,
        url: window.location.pathname,
        website: this.trackingId,
        data: attributes,
      },
      type: 'event',
    };

    /* Add extra data for Umami data events */
    if (action !== 'navigate') {
      payload.payload[NAME_PROPS] = `${subject}-${action}`;
    }

    if (this.debug) {
      // eslint-disable-next-line no-console
      console.debug(`Umami event: ${payload}`);
    }
    /* Do not send anything in test mode */
    if (!this.testMode) {
      try {
        await this.fetchApi.fetch(`${this.dataDomain}/api/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      }
    }
  }
}
