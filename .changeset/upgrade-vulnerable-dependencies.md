---
'app-next': patch
'app': patch
'backend': patch
'@axis-backstage/plugin-analytics-module-umami': patch
'@axis-backstage/plugin-jira-dashboard-backend': patch
'@axis-backstage/plugin-jira-dashboard': patch
'@axis-backstage/plugin-readme-backend': patch
'@axis-backstage/plugin-readme': patch
'@axis-backstage/plugin-statuspage-backend': patch
'@axis-backstage/plugin-statuspage': patch
'@axis-backstage/plugin-vacation-calendar': patch
---

Fix critical security vulnerabilities by upgrading Backstage dependencies:

**Security Fixes:**

- Fixed CVE-2025-8101 (High Severity) in linkifyjs/linkify-react by upgrading @backstage/core-components from ^0.18.4 to ^0.18.6
- Fixed CVE-2026-24046 (High Severity) - UNIX Symbolic Link Following in @backstage/backend-plugin-api by upgrading from ^1.6.0 to ^1.6.2
- Fixed CVE-2026-24047 (High Severity) - Symlink Attack in @backstage/backend-defaults by upgrading from ^0.14.0 to ^0.15.1
- Fixed SNYK-JS-QS-14724253 (High Severity) - Allocation of Resources Without Limits or Throttling in qs by adding resolution to ^6.14.1

**Additional Package Upgrades:**
Upgraded packages to versions that depend on patched Backstage core packages:

- @backstage/plugin-mcp-actions-backend: ^0.1.6 → ^0.1.8
- @backstage/plugin-search-backend: ^2.0.9 → ^2.0.11
- @backstage/plugin-techdocs-backend: ^2.1.3 → ^2.1.4
- @backstage/backend-test-utils: ^1.10.2 → ^1.10.4 (in jira-dashboard-backend and readme-backend)

**Code Improvements:**

- Removed redundant @backstage/backend-defaults imports from production code paths in backend plugins (jira-dashboard-backend, readme-backend, statuspage-backend)
