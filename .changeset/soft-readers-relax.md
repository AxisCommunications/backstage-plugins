---
'@axis-backstage/plugin-jira-dashboard': patch
---

Added the url pathname as part of the base URL for all links to Jira. This because Jira Server have additional path in the Jira base URl and links were broken.
