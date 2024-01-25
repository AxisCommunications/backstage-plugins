# Analytics Module: Umami

Welcome to the Analytics Module Umami plugin!

## Introduction

Backstage comes with an event-based analytics API that enables to collect and analyize Backstage usage. Currently, it supports analytics platform such as Google Analytics and New Relic. This plugin adds support for using [Umami](https://umami.is/) as analytics platform.

### This plugin:

- Is an implementation of the Backstage [AnalyticsAPI](https://backstage.io/docs/reference/core-plugin-api.analyticsapi/)

## Why Umami?

Umami describes themselves as "a simple, fast, privacy-focused, open-source analytics solution". It has support for tracking both events and routing.

## Getting started

1. First, install the plugin into your app:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @axis-backstage/plugin-analytics-module-umami
```

2. Then, add the following code to your `apis.ts` file.

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

On Umami's offical website can read more about how to [create a website in Umami](https://umami.is/docs/add-a-website) and [retreive the tracking code](https://umami.is/docs/collect-data).

If you want the tracker to only run on specific domains, you can add a [data-domain](https://umami.is/docs/tracker-configuration).

When you have your dataDomain and trackingId, add the following minimum configuration to start sending analyticsevents to Umami.

```yaml
# app-config.yaml
app:
  analytics:
    umami:
      dataDomain: https://umami.organization.com
      trackingId: edo7byeh-ca66-461d-b2d5-78b71bdcl667
```

## Configuration

### Debugging and testing

You may wish to set additional configurations in your `app-config.local.yaml` file. For instance, you can turn off reporting to Analytics and/or print debug statements to the
console. You can do so like this:

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
