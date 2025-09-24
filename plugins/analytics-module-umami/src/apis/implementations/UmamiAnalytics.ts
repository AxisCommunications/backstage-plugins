import {
  AnalyticsApi,
  AnalyticsEvent,
  AnalyticsEventAttributes,
  FetchApi,
  IdentityApi,
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
    id?: string; // Umami distinct id (only when Backstage identity available)
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
  private identityApi?: IdentityApi;
  private distinctId?: string;
  private enableDistinctId: boolean;

  /**
   * Instantiate the implementation and initialize Umami.
   */
  private constructor(options: {
    fetchApi: FetchApi;
    trackingId: string;
    dataDomain: string;
    debug?: boolean;
    testMode?: boolean;
    identityApi?: IdentityApi;
    enableDistinctId?: boolean;
  }) {
    const {
      fetchApi,
      trackingId,
      dataDomain,
      debug,
      testMode,
      identityApi,
      enableDistinctId,
    } = options;

    this.fetchApi = fetchApi;
    this.dataDomain = dataDomain;
    this.trackingId = trackingId;
    this.testMode = testMode || false;
    this.debug = debug || false;
    this.identityApi = identityApi;
    this.enableDistinctId = enableDistinctId ?? true;

    // initialize distinct id only from Backstage identity
    this.initDistinctId();
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
    const enableDistinctId =
      config.getOptionalBoolean('app.analytics.umami.enableDistinctId');

    return new UmamiAnalytics({
      fetchApi,
      trackingId,
      dataDomain,
      debug,
      testMode,
      identityApi,
      enableDistinctId,
    });
  }

  /**
   * Initialize the distinct ID from Backstage identity if available.
   */
  private async initDistinctId() {
    if (!this.enableDistinctId) return;

    if (!this.identityApi || !this.identityApi.getBackstageIdentity) {
      // identity not available — do not set a distinct id
      if (this.debug) {
        // eslint-disable-next-line no-console
        console.debug('[Umami] IdentityApi not provided; distinct id disabled for this session.');
      }
      return;
    }

    try {
      const identity = await this.identityApi.getBackstageIdentity();
      // use userEntityRef as stable identifier (matches Backstage example)
      const candidate = (identity as any)?.userEntityRef;

      if (candidate) {
        this.distinctId = candidate;
        if (this.debug) {
          // eslint-disable-next-line no-console
          console.debug(`[Umami] distinctId set from identity: ${this.distinctId}`);
        }
      } else if (this.debug) {
        // eslint-disable-next-line no-console
        console.debug('[Umami] Backstage identity provided but no userEntityRef present.');
      }
    } catch (e) {
      if (this.debug) {
        // eslint-disable-next-line no-console
        console.warn('[Umami] Failed to fetch Backstage identity:', e);
      }
    }
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
      },
      type: 'event',
    };

    /* Add extra data for Umami data events */
    if (action !== 'navigate') {
      payload.payload[NAME_PROPS] = `${subject}-${action}`;
    }

    // only include distinct id when we have a Backstage identity and the feature is enabled
    if (this.enableDistinctId && this.distinctId) {
      payload.payload.id = this.distinctId;
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
