# Jira Dashboard Backend

A plugin that makes requests to [Atlassian REST API](https://developer.atlassian.com/server/jira/platform/rest-apis/) to get issues and project information from Jira.

The frontend plugin that displays this information is [Jira Dashboard](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard).

## Setup

The following sections will help you get the Jira Dashboard Backend plugin setup and running.

### Installation

Install the plugin by following the example below:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @axis-backstage/plugin-jira-dashboard-backend
```

### Configuration

The Jira Dashboard plugin requires the following YAML to be added to your app-config.yaml:

```yaml
jiraDashboard:
  token: ${JIRA_TOKEN}
  baseUrl: ${JIRA_BASE_URL}
  apiUrl: ${JIRA_API_URL} # Optional
  headers: {} # Optional
  userEmailSuffix: ${JIRA_EMAIL_SUFFIX} # Optional
  annotationPrefix: ${JIRA_ANNOTATION_PREFIX} # Optional
```

#### Configuration Details:

- `JIRA_TOKEN`: The "Authorization" header used for Jira authentication.
  > Note: The JIRA_TOKEN variable from [Roadie's Backstage Jira plugin](https://roadie.io/backstage/plugins/jira) can not be reused here because of the added encoding in this token.
- `JIRA_BASE_URL`: The base url for Jira in your company, including the API version. For instance: https://jira.se.your-company.com/rest/api/2/
- `JIRA_API_URL`: Optional url for the Jira API, if different from the base url, including the API version. Necessary when using scoped API tokens with Jira Cloud. For instance: https://api.atlassian.com/ex/jira/7c9c39d8-d07d-43bd-924b-a82397d47f45/rest/api/2/
- The headers field can be used to add HTTP headers that will be added to the API requests.
- `JIRA_EMAIL_SUFFIX`: Optional email suffix used for retrieving a specific Jira user in a company. For instance: @your-company.com. If not provided, the user entity profile email is used instead.
- `JIRA_ANNOTATION_PREFIX`: Optional annotation prefix for retrieving a custom annotation. Defaut value is jira.com. If you want to configure the plugin to be compatible with [Roadie's Backstage Jira Plugin](https://roadie.io/backstage/plugins/jira/), use the following annotation prefix:

```yaml
jiraDashboard:
   {/* required configs... */}
  annotationPrefix: jira
```

### Multiple Jira instances

In case multiple Jira instances are being used, the configuration can be written on the form:

```yaml
jiraDashboard:
  annotationPrefix: ${JIRA_ANNOTATION_PREFIX} # Optional
  instances:
    - name: default
      token: ${JIRA_TOKEN}
      baseUrl: ${JIRA_BASE_URL}
      apiUrl: ${JIRA_API_URL} # Optional
      headers: {} # Optional
      userEmailSuffix: ${JIRA_EMAIL_SUFFIX} # Optional
    - name: separate-jira-instance
      token: ${JIRA_TOKEN_SEPARATE}
      baseUrl: ${JIRA_BASE_URL_SEPARATE}
      apiUrl: ${JIRA_API_URL_SEPARATE} # Optional
      headers: {} # Optional
      userEmailSuffix: ${JIRA_EMAIL_SUFFIX_SEPARATE} # Optional
```

In entity yamls that don't specify an instance, the one called `"default"` will be used. To specify another instace, prefix the project key with `instance-name/` such as:

```yaml
metadata:
  annotations:
    jira.com/project-key: separate-jira-instance/my-project-key
```

### Custom Jira Filters

You can define custom Jira filters directly in your `app-config.yaml` file. This allows you to create and display filters beyond the ones provided by the plugin.

#### Configuration

To add custom filters, use the `defaultFilters` property within a Jira instance configuration:

```yaml
jiraDashboard:
  instances:
    - name: my-jira-instance
      # ... other configuration ...
      defaultFilters:
        - name: 'Open Bugs'
          shortName: 'Bugs'
          query: 'type = bug AND resolution = Unresolved ORDER BY updated DESC, priority DESC'
        - name: 'Epics'
          shortName: 'Epics'
          query: 'type = epic AND resolution = Unresolved ORDER BY updated DESC, priority DESC'
```

#### Authentication examples and trouble shooting

Either "Basic Auth" or "Personal Acccess Tokens" can be used.

This plugin will directly take the content of the "jiraDashboard.token" config string and
use as the "Authorization" header in all Jira REST API calls.

##### Basic Auth example

To use "Basic Auth" for authentication you need to create the "Authentication" header. See the [Jira documentation](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/#supply-basic-auth-headers) how to create and encode the token. This is the how to use the example token from the documentation (`ZnJlZDpmcmVk`) with `curl`.

```sh
curl -D- \
   -X GET \
   -H "Authorization: Basic ZnJlZDpmcmVk" \
   -H "Content-Type: application/json" \
   "https://your-domain.atlassian.net/rest/api/2/project/BS"
```

This would result in the following Backstage configuration:

```yaml
jiraDashboard:
  token: Basic ZnJlZDpmcmVk
  baseUrl: https://your-domain.atlassian.net/rest/api/2/
  userEmailSuffix: ${JIRA_EMAIL_SUFFIX}
```

##### Personal Acccess Tokens example

See the [Personal Acccess Tokens](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html) documentation how to use and create
a PAT. The generated token can be directly used, there is no need to encode it. Using
`curl` with a PAT.

```sh
curl -D- \
   -X GET \
   -H "Authorization: Bearer <Token>" \
   -H "Content-Type: application/json" \
   "https://your-domain.atlassian.net/rest/api/2/project/BS"
```

And the corresponding Backstage configuration:

```yaml
jiraDashboard:
  token: Bearer <Token>
  baseUrl: https://your-domain.atlassian.net/rest/api/2/
  userEmailSuffix: ${JIRA_EMAIL_SUFFIX}
```

##### Using Scoped API Tokens with Atlassian Cloud

If you want to use scoped API tokens, which allow limiting the permission of the token, you need to call a different Atlassian API endpoint and use a unique `apiUrl` ([see the documentation here](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token-with-scopes)). You will still need to enter the `baseUrl` as well, which should point to your Jira instance (including the API version information).

Note: this API endpoint uses your `cloudid` which can be found as described in [this article](https://support.atlassian.com/jira/kb/retrieve-my-atlassian-sites-cloud-id/).

Here is an example configuration which works with scoped API tokens:
```yaml
jiraDashboard:
  token: Basic ZnJlZDpmcmVk
  baseUrl: https://your-domain.atlassian.net/rest/api/2/
  apiUrl: https://api.atlassian.com/ex/jira/7c9c39d8-d07d-43bd-924b-a82397d47f45/rest/api/2/
```

The only required classic scope for this plugin is:

- read:jira-work

### Integrating

The Jira Dashboard backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/). Here is how you can set it up:

In your `packages/backend/src/index.ts` make the following changes:

```diff

const backend = createBackend();
+ backend.add(import('@axis-backstage/plugin-jira-dashboard-backend'));
// ... other feature additions

backend.start();
```
