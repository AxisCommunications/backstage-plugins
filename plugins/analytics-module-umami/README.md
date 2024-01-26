# Analytics Module: Umami

Welcome to the Analytics Module Umami plugin!

## Introduction

This plugin is an implementation of the Backstage [AnalyticsAPI](https://backstage.io/docs/reference/core-plugin-api.analyticsapi/).

Backstage comes with an event-based analytics API that enables to collect and analyze Backstage usage. Currently, it supports analytics platform such as Google Analytics and New Relic. This plugin adds support for instead using the open-source web analytics platforms [Umami](https://umami.is/) with Backstage.

## Why Umami?

Umami describes themselves as "a simple, fast, privacy-focused, open-source analytics solution".

## Getting started

In order to start tracking events in Backstage and send them to your Umami instance, you will need to:

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
  identityApiRef,
} from '@backstage/core-plugin-api';
import { GoogleAnalytics4 } from '@backstage/plugin-analytics-module-ga4';

export const apis: AnyApiFactory[] = [
  // Instantiate and register the Umami API Implementation.
  createApiFactory({
    api: analyticsApiRef,
    deps: {
      configApi: configApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ configApi, fetchApi }) =>
      UmamiAnalytics.fromConfig(configApi, { fetchApi }),
  }),
];
```

3. Configure the plugin in your `app-config.yaml`:

You need to configure the **Umami tracking id** to your `app-config.yaml` file to start sending analytics events to your Umami instance. If you do not know how to find your tracking code, Umami's offical website explain how to [create a website](https://umami.is/docs/add-a-website) and [retreive the tracking code](https://umami.is/docs/collect-data).

You also need to add a [data-domain](https://umami.is/docs/tracker-configuration) in order to only track data on specific domains.

```yaml
# app-config.yaml
app:
  analytics:
    umami:
      dataDomain: https://umami.organization.com
      trackingId: edo7byeh-ca66-461d-b2d5-78b71bdcl667
```

## Usage

Just like all Backstage AnalyticsAPI implementation, this plugin tracks the following events: `click`, `navigate`, `create`, `search`, `discover`, and `not-found`. You can read more about the key events in Backstage analytics in the [upstream documentation](https://backstage.io/docs/plugins/analytics/#key-events)

In this plugin, all `navigation` events are handled as Umami pageviews. Other events, such as click and discover, are handled as [Umami events](https://umami.is/docs/track-events). In Umami documentation you can read more on how to track events that occur on your website.

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

## Developing

This plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/analytics-module-umami](http://localhost:3000/analytics-module-umami).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
