---
'@axis-backstage/plugin-jira-dashboard': major
---

Migrate Jira Dashboard to Backstage UI. Cards, tabs, links, now use Backstage UI components.

The migration removes the `@mui/material` and `@mui/styles` direct dependencies, but keeping using MUI tables.

**Breaking:** Consumers must install and configure `@backstage/ui`.
