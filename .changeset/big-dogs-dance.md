---
'@axis-backstage/plugin-jira-dashboard-backend': minor
---

Updated the resolveUserEmailSuffix function to utilize config.getOptionalString method, providing a more concise approach. This modification ensures that an empty string is returned if the Jira user email suffix configuration is missing, effectively preventing failures and enhancing error logging capabilities.

Modified the retrieval of project keys in the router module to handle multiple project keys specified in annotations for e.g., jira.com/project-key: abc,def,ghi
The updated logic now parses multiple project keys properly and supports comma-separated values. It's important to note that in cases where multiple project keys are present, only the first project key (projectKey[0]) is used for display on the project card i.e, in this case project-key "abc", assuming it represents the main project. However, the response table will include data from all project keys specified in the annotations.
