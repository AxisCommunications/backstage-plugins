---
'@axis-backstage/plugin-vacation-calendar': minor
---

Migrate the vacation calendar to Backstage UI, TanStack Query v5, Day.js, and
react-calendar-timeline v0.30. The calendar now uses a Backstage UI date picker.

The migration removes a number of legacy Material UI, date-picker, and timeline
dependencies.

**Breaking:** Consumers must install and configure `@backstage/ui`.
