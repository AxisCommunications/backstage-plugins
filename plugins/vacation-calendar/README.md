# Vacation Calendar plugin

Welcome to the Vacation Calendar plugin!

![calendar-year-light-example](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/vacation-calendar/media/year-light.png)
![calendar-year-dark-example](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/vacation-calendar/media/year-dark.png)

## Introduction

The Vacation Calendar plugin allows you to get a comprehensive overview of your colleagues' vacations and out-of-office events. Clearly see when your vacations overlap or which team members will be present on specific occasions, making your life and teamwork easier and more efficient.

Our plugin is based on [Microsoft-Calendar Plugin](https://github.com/backstage/community-plugins/tree/main/workspaces/microsoft-calendar/plugins/microsoft-calendar) with modifications for focusing on multiple users' calendars. Full credit to them for their great plugin!

## How it works

The plugin interacts with the Microsoft Graph API to fetch users' calendars and schedule items. Mark your events as Out of Office in either the Outlook client or the Teams client. By marking your events as "Out of Office," they will be correctly reflected in the Vacation Calendar plugin, providing an accurate overview of your availability.

## Autentication

The Vacation Calendar plugin requires Microsoft authentication. If you have not set this up, please follow the upstream guide on Microsoft authentication: [Backstage.io Microsoft Authentication Guide](https://backstage.io/docs/auth/microsoft/provider/).

At present, the plugin supports only Microsoft authentication and does not integrate with other Backstage authentication methods. If you need the plugin to support a different authentication method, please create an issue so we can discuss your requirements.

## Getting started

1. First, install the plugin into your app:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @axis-backstage/plugin-vacation-calendar
```

2. Setup the API-factory.

```ts
// packages/app/src/apis.ts:
import {
  vacationCalendarApiRef,
  VacationCalendarApiClient,
} from '@axis-backstage/plugin-vacation-calendar';

createApiFactory({
    api: vacationCalendarApiRef,
    deps: {
      authApi: microsoftAuthApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ authApi, fetchApi }) =>
      new VacationCalendarApiClient({ authApi, fetchApi }),
  }),

```

3. Modify your entity page to include the `VacationCalendarPage` component:

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { VacationCalendarPage } from '@axis-backstage/plugin-vacation-calendar';

const groupPage = (
  <EntityLayout>
    <EntityLayout.Route path="/vacation-calendar" title="Out Of Office">
      <Grid md={6}>
        <VacationCalendarPage />
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);
```

By doing this, all Backstage users who are part of that group will be displayed in the `Out of Office` tab on the group's entity page.

## Integration with the Catalog

To fetch all colleagues with the same manager for a user entity, add the manager annotation to the entity's **catalog-info.yaml** file:

```yaml
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  # ...
  annotations:
    manager: value # The Backstage username of the mananger
```

If the manager annotation is set, you can display all users with the same manager for a user entity. To do this, add the `VacationCalendarPage` component to the entity page for users:

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { VacationCalendarPage } from '@axis-backstage/plugin-vacation-calendar';

const userPage = (
  <EntityLayout>
    <EntityLayout.Route path="/vacation-calendar" title="Out Of Office">
      <Grid md={6}>
        <VacationCalendarPage />
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);
```

## Development

The plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/vacation-calendar](http://localhost:3000/vacation-calendar).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Screenshots

![calendar-month-light-example](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/vacation-calendar/media/month-light.png)
![calendar-month-dark-example](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/vacation-calendar/media/month-dark.png)
