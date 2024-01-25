import {
  AnalyticsApi,
  AnalyticsEvent,
  FetchApi,
} from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';

/**
 * Umami Analytics API provider for the Backstage Analytics API.
 * @public
 */
export class UmamiAnalytics implements AnalyticsApi {
  private readonly fetchApi: FetchApi;
  private host: string;
  private trackingId: string;
  private debug: boolean;
  private testMode: boolean;

  /**
   * Instantiate the implementation and initialize ReactGA.
   */
  private constructor(options: {
    fetchApi: FetchApi;
    trackingId: string;
    host: string;
    debug?: boolean;
    testMode?: boolean;
  }) {
    const { fetchApi, trackingId, host, debug, testMode } = options;
    this.fetchApi = fetchApi;
    this.host = host;
    this.trackingId = trackingId;
    this.testMode = testMode || false;
    this.debug = debug || false;
  }

  /**
   * Instantiate a fully configured GA Analytics API implementation.
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
    const host = config.getOptionalString('app.analytics.umami.host') || '';
    const debug = config.getOptionalBoolean('app.analytics.umami.debug');
    const testMode = config.getOptionalBoolean('app.analytics.umami.testMode');

    return new UmamiAnalytics({
      fetchApi,
      trackingId,
      host,
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
    // No configuration is set. Do nothing.
    if (!this.trackingId || !this.host) {
      return;
    }
    // Only track the naviagation updates for now.
    if (event.action !== 'navigate') {
      return;
    }
    const {
      screen: { width, height },
      navigator: { language },
    } = window;
    const { hostname } = location;

    const payload = {
      payload: {
        hostname,
        language,
        referrer: '',
        screen: `${width}x${height}`,
        title: 'dashboard',
        url: event.subject,
        website: this.trackingId,
      },
      type: 'event',
    };

    if (this.debug) {
      console.debug(`Umami event: ${payload}`);
    }
    // Do not send anything in test mode.
    if (!this.testMode) {
      try {
        await this.fetchApi.fetch(`${this.host}/api/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.warn(error);
      }
    }
  }
}
