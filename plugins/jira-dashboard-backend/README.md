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
- `JIRA_ANNOTATION_PREFIX`: Optional annotation prefix for retrieving a custom annotation. Default value is jira.com. If you want to configure the plugin to be compatible with [Roadie's Backstage Jira Plugin](https://roadie.io/backstage/plugins/jira/), use the following annotation prefix:

```yaml
jiraDashboard:
   {/* required configs... */}
  annotationPrefix: jira
```

### Jira API Version Configuration

The plugin supports both Jira REST API v2 (default) and v3. You can enable API v3 by setting the `useApiV3` configuration option:

```yaml
jiraDashboard:
  token: ${JIRA_TOKEN}
  baseUrl: ${JIRA_BASE_URL}
  useApiV3: true # Enable Jira API v3 (defaults to false)
```

#### API Version Differences:

- **API v2 (default)**: Uses the `/search` endpoint for JQL queries
- **API v3**: Uses the `/search/jql` endpoint for JQL queries

When `useApiV3` is set to `true`, the plugin will use the v3 API endpoints. When `useApiV3` is `false` or not specified, the plugin will continue to use the v2 API endpoints for backward compatibility.

#### Example with API v3:

```yaml
jiraDashboard:
  token: Bearer <your-token>
  baseUrl: https://your-domain.atlassian.net/rest/api/3/
  useApiV3: true
  userEmailSuffix: @your-company.com
```

**Note**: When using API v3, make sure your `baseUrl` also points to the v3 endpoint (e.g., `/rest/api/3/` instead of `/rest/api/2/`).

### Cache Configuration

The plugin includes configurable caching to improve performance by reducing API calls to Jira. You can configure the cache TTL (Time To Live) for each Jira instance:

```yaml
jiraDashboard:
  token: ${JIRA_TOKEN}
  baseUrl: ${JIRA_BASE_URL}
  cacheTtl: 30m # Cache for 30 minutes (defaults to 1h if not specified)
```

#### Supported TTL Formats:

The `cacheTtl` option accepts human-readable duration formats as a string:

- `30s` - 30 seconds
- `10m` - 10 minutes
- `1h` - 1 hour
- `2h30m` - 2 hours and 30 minutes
- `1d` - 1 day

Or an object like:

```yaml
jiraDashboard:
  cacheTtl:
    hours: 2
```

#### Default Cache Behavior:

- **Default TTL**: 1 hour if not specified
- **Cache Scope**: Project information and JQL query results are cached per Jira instance
- **Cache Keys**: Unique per project key and JQL query to ensure data accuracy

#### Example with custom cache TTL:

```yaml
jiraDashboard:
  token: Bearer <your-token>
  baseUrl: https://your-domain.atlassian.net/rest/api/2/
  cacheTtl: 15m # Cache responses for 15 minutes
  userEmailSuffix: @your-company.com
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
      useApiV3: false # Optional - defaults to false
      cacheTtl: 1h # Optional - defaults to 1 hour
    - name: separate-jira-instance
      token: ${JIRA_TOKEN_SEPARATE}
      baseUrl: ${JIRA_BASE_URL_SEPARATE}
      apiUrl: ${JIRA_API_URL_SEPARATE} # Optional
      headers: {} # Optional
      userEmailSuffix: ${JIRA_EMAIL_SUFFIX_SEPARATE} # Optional
      useApiV3: true # Optional - enable API v3 for this instance
      cacheTtl: 30m # Optional - cache for 30 minutes for this instance
```

Each instance can have its own `useApiV3` and `cacheTtl` settings, allowing you to mix v2 and v3 API usage and customize cache durations across different Jira instances.

In entity yamls that don't specify an instance, the one called `"default"` will be used. To specify another instance, prefix the project key with `instance-name/` such as:

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

Either "Basic Auth" or "Personal Access Tokens" can be used.

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

##### Personal Access Tokens example

See the [Personal Access Tokens](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html) documentation how to use and create
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

Authentication with Jira Cloud may require configuring basic auth like this.
Note that the email and token must be base64 encoded. This what the configuration
will look like before the encoding step.

```yaml
jiraDashboard:
  token: Basic email@example.com:pat_token
  baseUrl: https://your-domain.atlassian.net/rest/api/2/
  userEmailSuffix: ${JIRA_EMAIL_SUFFIX}
```

And this is the actual Backstage configuration where the "email@example.com:pat_token" string
has been base64 encoded.

```yaml
jiraDashboard:
  token: Basic ZW1haWxAZXhhbXBsZS5jb206cGF0X3Rva2Vu
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

## Actions

The Jira Dashboard backend includes actions for the Backstage action registry.

### Available Actions

#### get-jira-ticket-info

Retrieves summary and description for a specific Jira ticket by its key.

**Input:**

- `issueKey` (required): Jira issue key in format PROJECT-NUMBER (e.g., "PROJ-123", "ABC-456")
- `instance` (optional): Jira instance name when multiple instances are configured. Omit to use the default instance.

**Output:**

- `key`: The Jira issue key
- `summary`: Brief one-line summary of the issue
- `description`: Detailed description of the issue (may be empty if no description was provided)

### Configuration

To enable these actions, add the following to your `app-config.yaml`:

```yaml
backend:
  actions:
    pluginSources:
      - 'jira-dashboard'
```
