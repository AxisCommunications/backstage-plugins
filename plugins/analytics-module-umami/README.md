# Analytics Module: Umami

Welcome to the Analytics Module Umami plugin!

## Introduction

This plugin is an implementation of the Backstage [AnalyticsAPI](https://backstage.io/docs/reference/core-plugin-api.analyticsapi/).

Backstage comes with an event-based analytics API that enables to collect and analyze Backstage usage. Currently, it supports analytics platforms such as Google Analytics and New Relic. This plugin adds support for using the open-source web analytics platforms [Umami](https://umami.is/) with Backstage.

## What is Umami?

Umami describes themselves as "a simple, fast, privacy-focused, open-source analytics solution". It supports tracking events and route changes.

## Getting started

In order to start tracking events in Backstage and send them to your Umami instance, you need to:

1. Install the plugin into your app:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @axis-backstage/plugin-analytics-module-umami
```

2. Add the plugin to your Backstage instance by adding the following code to your `apis.ts` file.

```tsx
// packages/app/src/apis.ts
import {
  analyticsApiRef,
  configApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { UmamiAnalytics } from '@axis-backstage/plugin-analytics-module-umami';

export const apis: AnyApiFactory[] = [
  // Instantiate and register the Umami API Implementation.
  createApiFactory({
    api: analyticsApiRef,
    deps: {
      configApi: configApiRef,
      fetchApi: fetchApiRef,
      identityApi: identityApiRef, // Optional, for distinct user tracking
    },
    factory: ({ configApi, fetchApi, identityApi }) =>
      UmamiAnalytics.fromConfig(configApi, { fetchApi, identityApi }),
  }),
];
```

3. Configure the plugin in your `app-config.yaml`:

You need to add the **Umami tracking id** and **data domain** to your `app-config.yaml` file in order to start sending analytics events to your Umami instance.

If you do not know how to find your tracking id, Umami's offical website explain how to [create a website](https://umami.is/docs/add-a-website) and [retreive the tracking code](https://umami.is/docs/collect-data).

You need to specify the [data-domain](https://umami.is/docs/tracker-configuration) to `app-config.yaml` in order to only track data on specific domains.

```yaml
# app-config.yaml
app:
  analytics:
    umami:
      dataDomain: https://umami.organization.com
      trackingId: edo7byeh-ca66-461d-b2d5-78b71bdcl667
```

## Usage

Just like all Backstage AnalyticsAPI implementation, this plugin tracks the following events: `click`, `navigate`, `create`, `search`, `discover`, and `not-found`. You can read more about the key events in Backstage analytics in the [upstream documentation](https://backstage.io/docs/plugins/analytics/#key-events).

In this plugin, all `navigation` events are handled as Umami pageviews. Other events, such as click and discover, are handled as Umami events. In Umami documentation you can read more on how to track [events] (https://umami.is/docs/track-events)that occur on your website.

## Distinct User Tracking

This plugin supports distinct user tracking using Backstage's identity system. When the `identityApi` is provided in the plugin configuration, the plugin will automatically:

- Extract the Backstage user's entity reference (e.g., `user:default/alice`) as a persistent, unique identifier
- Include this identifier in the Umami analytics payload as `payload.id`
- Enable accurate user analytics and journey tracking across sessions and devices by leveraging Umami's [distinct ID feature](https://umami.is/docs/distinct-ids)

This feature requires no additional configuration beyond providing the `identityApi` dependency when registering the plugin (see step 2 in Getting Started).

## Debugging and testing

You may wish to set additional configurations in your `app-config.local.yaml` file.

For instance, you can turn off reporting to Analytics and/or print debug statements to the console. You can do so like this:

```yaml
app:
  analytics:
    umami:
      testMode: true # Prevents data being sent to Umami
      debug: true # Logs analytics event to the web console
```

You can also turn off reporting to Analytics for your own visits as described in the [Umami docs](https://umami.is/docs/exclude-my-own-visits).
