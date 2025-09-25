import {
  AnalyticsApi,
  AnalyticsEvent,
  AnalyticsEventAttributes,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';

/**
 * Interface representing the payload structure for Umami analytics events.
 * Contains both required tracking data and optional event-specific information.
 */
interface IPayload {
  /**
   * The main payload object containing all tracking and event data.
   */
  payload: {
    /**
     * The hostname of the current page or application.
     */
    hostname: string;
    /**
     * The language setting of the user's browser or application.
     */
    language: string;
    /**
     * The URL of the referring page that led to the current page.
     */
    referrer: string;
    /**
     * Screen resolution information in the format "widthxheight".
     */
    screen: string;
    /**
     * The title of the current page or view.
     */
    title: string;
    /**
     * The current URL or route being tracked.
     */
    url: string;
    /**
     * The website identifier or domain being tracked.
     */
    website: string;
    /**
     * Optional custom event name for specific analytics events.
     */
    name?: string;
    /**
     * Additional custom data and attributes associated with the analytics event.
     */
    data: AnalyticsEventAttributes | undefined;
    /**
     * Optional unique identifier for the user using Umami's distinct ID feature.
     * See: https://umami.is/docs/distinct-ids
     * Only available when Backstage identity is accessible.
     */
    id?: string;
  };
  /**
   * The type of analytics event being tracked (e.g., "pageview", "event").
   */
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
  private distinctId?: string;
  /**
   * Instantiate the implementation and initialize Umami.
   */
  private constructor(options: {
    fetchApi: FetchApi;
    identityApi?: IdentityApi;
    trackingId: string;
    dataDomain: string;
    debug?: boolean;
    testMode?: boolean;
  }) {
    const { fetchApi, trackingId, dataDomain, debug, testMode, identityApi } =
      options;

    this.fetchApi = fetchApi;
    this.dataDomain = dataDomain;
    this.trackingId = trackingId;
    this.testMode = testMode || false;
    this.debug = debug || false;

    // enable distinct id only when IdentityApi is provided
    if (identityApi) {
      identityApi.getBackstageIdentity().then(identity => {
        // Initialize Umami with the user ID from Backstage identity
        this.distinctId = identity.userEntityRef;
      });
    }
  }

  /**
   * Instantiate a fully configured Umami Analytics API implementation.
   */
  /**
   * Initialize UmamiAnalytics from configuration.
   */
  static fromConfig(
    config: Config,
    options: { fetchApi: FetchApi; identityApi?: IdentityApi },
  ) {
    const { fetchApi, identityApi } = options;

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
      identityApi,
    });
  }

  /**
   * Returns whether tracking is disabled.
   *
   * Tracking is disabled if:
   * - testMode is enabled
   * - localStorage has a key 'umami.disabled' set
   *
   * @returns true if tracking is disabled
   */
  private isTrackingDisabled() {
    return this.testMode || localStorage?.getItem('umami.disabled');
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
        id: this.distinctId,
      },
      type: 'event',
    };

    /* Add extra data for Umami data events */
    if (action !== 'navigate') {
      payload.payload[NAME_PROPS] = `${subject}-${action}`;
    }

    if (this.debug) {
      // eslint-disable-next-line no-console
      console.debug('Umami event payload:', payload);
    }
    /* Do not send anything when tracking is disabled */
    if (!this.isTrackingDisabled()) {
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
