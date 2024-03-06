---
'@axis-backstage/plugin-jira-dashboard-backend': major
'@axis-backstage/plugin-jira-dashboard': major
'@axis-backstage/plugin-jira-dashboard-common': minor
---

## jira-dashboard

Simplified Registration and Rendering: Streamlined Jira Dashboard plugin registration and rendering in Backstage.
New Utility Function: Added getJiraUrl function in lib.ts to fetch Jira host URL and introduced new annotations for Jira-related functionalities.
Enhanced Functionality: Simplified isJiraDashboardAvailable function in plugin.ts for better entity availability checks.
Improved URL Handling: Modified JiraDashboardClient to encode entityRef parameter for proper URL handling.
Enhanced JiraTable: Updated JiraTable with additional props, error message handling, and styling improvements.

---

JiraDashboardBackend( improved functionality and error handling)
getProjectInfo: Now casts the response to any before checking its status and handling the JSON response.
getFilterById: Added a fallback to return a custom Filter object if the filter is not found.
getIssuesByFilter: Accepts a logger parameter to log error messages and returns a custom JiraAPIResponse object.
filters.ts (getDefaultFilters): Expanded to handle additional configurations, generating filters based on provided config and userRef. Falls back to default filters if necessary.
router.ts: Standardized route parameters to use :entityRef, enhanced error handling for the getIssuesByFilter route, and improved error logging for the Jira search route.
service.ts: Refactored to standardize route parameters, improve error handling, and enhance logging in functions like getIssuesFromFilters and getIssuesFromComponents.
These changes enhance functionality, error handling, and logging capabilities across the JiraDashboardBackend.
jiraDashboard-comman
standardization of annotation names for Jira-related functionalities within the Jira Dashboard plugin in Backstage.
changes in types
