# Statuspage.io plugin

Welcome to the Statuspage.io plugin!

## Introduction

The **Statuspage** plugin allows you to embedd https://statuspage.io components, component groups and dashboards in Backstage.

There is a React-card, `<StatuspageEntityComponent />`, that is suitable for the Entity component/service overview page:

![entity-card](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/statuspage/media/entity-card.png)

And also one card, `<StatuspageComponent instance="myinstance"/>`, for easy integration of a complete Statuspage. This component is *not* dependent
on the `useEntity()`-hook, making it easy to integrate on the Home-page (or some other portal).

![full-status](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/statuspage/media/full-status.png)

## Note

You will **need** to also perform the installation instructions in [Statuspage Backend](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/statuspage-backend) in order for this plugin to work.

## Getting Started

1. First, install the plugin into your app:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @axis-backstage/plugin-statuspage
```

2. Setup configuration

```yaml
statuspage:
  instances:
    - name: mystatuspageinstance
      pageid: abc123foo456
      token: ${STATUSPAGE_TOKEN}
      link: https://<your statuspage>.statuspage.io # Optional
```

If you have access to the Statuspage.io dashboard, your page ID is usually visible in the URL when you're logged in and managing your page. Look for a segment in the URL that appears after `/manage/pages/`. The format usually looks something like `https://manage.statuspage.io/pages/YOUR_PAGE_ID`.

3. Then, modify your entity page in `EntityPage.tsx` to include the `StatuspageEntityComponent` component and the `isStatuspageAvailable` function. Both are exported from the plugin. The example below show how you can add the plugin to the `defaultEntityPage`:

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { StatuspageEntityComponent, isStatuspageAvailable } from '@axis-backstage/plugin-statuspage';

const defaultEntityPage = (
      <EntitySwitch>
        <EntitySwitch.Case if={isStatuspageAvailable}>
          <Grid item xs={12}>
            <StatuspageEntityComponent />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>
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
    statuspage.io/components: instance:component_id,component_id,component_id # Jira component name separated with a comma
```

The `instance` here is the `statuspage.instance.nam` config value.

The `component_id` could be the id of either a component or a component group. This can be found in your statuspage.io management interface:

![component_id](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/statuspage/media/component_id.png)