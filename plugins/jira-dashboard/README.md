# Jira Dashboard plugin

Welcome to the Jira Dashboard plugin!

![project-card](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard/media/project-card.png)

## Introduction

The **Jira Dashboard** plugin allows you to fetch and display Jira issues for your entity. You get quickly access to issue summaries to achieve better task visibility and more efficient project management. The issue overview that is provided can be customized to display the information that is relevant for your entity, by defining Jira filters and components.

This plugin supports both **Jira Software** and **Jira Cloud**.

By default, the issue views that are provided are **incoming issues**, **open issues** and **assigned to you**.

## Jira Dashboard backend

You **need** to set up the [Jira Dashboard Backend](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard-backend) plugin before you move forward with any of these steps if you haven't already.

## Getting Started

1. First, install the plugin into your app:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @axis-backstage/plugin-jira-dashboard
```

2. Then, modify your entity page in `EntityPage.tsx` to include the `EntityJiraDashboardContent` component and the `isJiraDashboardAvailable` function. Both are exported from the plugin. The example below show how you can add the plugin to the `defaultEntityPage`:

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { EntityJiraDashboardContent, isJiraDashboardAvailable } from '@axis-backstage/plugin-jira-dashboard';

const defaultEntityPage = (
  <EntityLayout.Route
    if={isJiraDashboardAvailable}
    path="/jira-dashboard"
    title="Jira Dashboard"
  >
    <EntityJiraDashboardContent />
  </EntityLayout.Route>
  ...
);
```

OPTIONAL: The function `isJiraDashboardAvailable` checks for the annotation `jira.com`. You can choose to check for another annotation by passing the prop `annotationPrefix` into the function. If you do this, be sure you've set the [optional annotationPrefix value](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard-backend#configuration-details) in the backend config to the same string. See example below.

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { EntityJiraDashboardContent, isJiraDashboardAvailable } from '@axis-backstage/plugin-jira-dashboard';

const defaultEntityPage = (
  <EntityLayout.Route
    if={entity => isJiraDashboardAvailable(entity, 'jira')}
    path="/jira-dashboard"
    title="Jira Dashboard"
  >
    <EntityJiraDashboardContent />
  </EntityLayout.Route>
  ...
);
```

### Homepage component - user issues list (optional)

List of user issues on the homepage can be enabled by this code in your `app/src/components/home/Homepage.tsx` :

![user-issues-list.png](media%2Fuser-issues-list.png)

```tsx
import { JiraUserIssuesViewCard } from '@axis-backstage/plugin-jira-dashboard';
// ...

<Grid item xs={12} md={6}>
  <JiraUserIssuesViewCard
    bottomLinkProps={{
      link: 'https://our-jira-server/issues',
      title: 'Open in Jira',
    }}
  />
</Grid>;

// ...
```

Note that the list of user issues is limited by permissions defined for the [JIRA_TOKEN](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard-backend/README.md#configuration-details) used by backend.
The username is being extracted from the user's email or created as a combination of user entity `metadata.name` and [JIRA_EMAIL_SUFFIX](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard-backend/README.md#configuration-details) ([see function `getAssigneUser`](/plugins/jira-dashboard-backend/src/filters.ts) for more information).

### Integration with the Catalog

To enable the Jira Dashboard plugin for your entity, the entity yaml must have the following annotation:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    jira.com/project-key: value # The key of the Jira project to track for this entity
```

### Optional annotations

If you want to track specific components or filters for your entity, you can add the optional annotations `components` and `filters-ids`. You can specify an endless number of Jira components or filters.

If your Jira project does not use "New" as status for incoming issues, you can specify which status to use through the `incoming-issues-status` annotation.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    jira.com/project-key: value # The key of the Jira project to track for this entity
    jira.com/components: component,component,component # Jira component name separated with a comma. The Roadie Backstage Jira Plugin Jira annotation `/component` is also supported here by default
    jira.com/filter-ids: 12345,67890 # Jira filter id separated with a comma
    jira.com/incoming-issues-status: Incoming # The name of the status for incoming issues in Jira. Default: New
```

### New Frontend System (Alpha)

The Jira Dashboard plugin also has support for the [new alpha frontend system](https://backstage.io/docs/frontend-system/). Here is how you can set it up:

1. First, install the plugin into your app:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @axis-backstage/plugin-jira-dashboard
```

2. [Configure the extension](https://backstage.io/docs/frontend-system/building-apps/configuring-extensions) inside `app-config.yaml` to include the entity-content:

```tsx
app:
  extensions:
    - entity-content:jira-dashboard/entity
```

By default, the Jira tab will only appear on entities that are Components or Groups. You override which [entity kinds](https://backstage.io/docs/features/software-catalog/system-model) the Jira dashboard appears on by adding a config underneath the entity-content, like so:

```tsx
app:
  extensions:
    - entity-content:jira-dashboard/entity
        config:
          filter: kind:component,system,group
```

3. [Install the plugin](https://backstage.io/docs/frontend-system/building-apps/index#install-features-manually) by updating `app/arc/App.tsx` to include the plugin in the features block during app creation:

```tsx
import { createApp } from '@backstage/frontend-app-api';
import jiraPlugin from '@axis-backstage/plugin-jira-dashboard/alpha';

...
const app = createApp({
  features: [
    ...,
    jiraPlugin,
    ],
});
export default app.createRoot();
```

4. [OPTIONAL] The plugin by default checks for the annotation `jira.com`. You can choose to check for another annotation by passing an `annotationPrefix` extension into the app. If you do this, be sure you've set the [optional annotationPrefix value](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard-backend#configuration-details) in the backend config to the same string. See example below.

```tsx
import { createApp, createExtension, createExtensionOverrides, } from '@backstage/frontend-app-api';
import jiraPlugin from '@axis-backstage/plugin-jira-dashboard/alpha';

const jiraAnnotationExtension = createExtension({
  name: 'myJiraAnnotation',
  attachTo: { id: 'entity-content:jira-dashboard/entity', input: 'props' },
  output: [annotationPrefixExtensionDataRef],

  factory() {
    // This can be any value you want to check for
    return [ annotationPrefixExtensionDataRef('jira') ];
  },
});
const app = createApp({
  features: [
    ...,
    jiraPlugin,
    ],
    createExtensionOverrides({
      extensions: [jiraAnnotationExtension,],
    }),
});
export default app.createRoot();
```

## Layout

The issue overview is located under the tab "Jira Dashboard" on the entity page. The overview displays information about the specific Jira project, and then renders one table for each type of issue view. In each view you can see the priority, assignee and status for that issue.

![overview](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard/media/overview.png)

![quickview](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard/media/quick-view.png)
