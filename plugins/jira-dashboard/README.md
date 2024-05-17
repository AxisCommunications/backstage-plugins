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

OPTIONAL: The function `isJiraDashboardAvailable` checks for the annotation `jira.com`. You can choose to check for another annotation by passing the prop `annotationPrefix` into the function. See example below.

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

If your Jira project does not use "New" as status for incoming issues, you can specify which status to use through the `incoming-issues-status annotation.

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

## Layout

The issue overview is located under the tab "Jira Dashboard" on the entity page. The overview displays information about the specific Jira project, and then renders one table for each type of issue view. In each view you can see the priority, assignee and status for that issue.

![overview](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard/media/overview.png)

![quickview](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard/media/quick-view.png)
