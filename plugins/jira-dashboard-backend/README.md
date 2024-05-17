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
  userEmailSuffix: ${JIRA_EMAIL_SUFFIX} # Optional
  annotationPrefix: ${JIRA_ANNOTATION_PREFIX} # Optional
```

#### Configuration Details:

- `JIRA_TOKEN`: The "Authorization" header used for Jira authentication.
  > Note: The JIRA_TOKEN variable from [Roadie's Backstage Jira plugin](https://roadie.io/backstage/plugins/jira) can not be reused here because of the added encoding in this token.
- `JIRA_BASE_URL`: The base url for Jira in your company, including the API version. For instance: https://jira.se.your-company.com/rest/api/2/
- `JIRA_EMAIL_SUFFIX`: Optional email suffix used for retrieving a specific Jira user in a company. For instance: @your-company.com. If not provided, the user entity profile email is used instead.
- `JIRA_ANNOTATION_PREFIX`: Optional annotation prefix for retrieving a custom annotation. Defaut value is jira.com. If you want to configure the plugin to be compatible with [Roadie's Backstage Jira Plugin](https://roadie.io/backstage/plugins/jira/), use the following annotation prefix:

```yaml
jiraDashboard:
   {/* required configs... */}
  annotationPrefix: jira
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

### Integrating

Here's how to get the backend plugin up and running:

1. Create a new file named `packages/backend/src/plugins/jiraDashboard.ts`, and add the following to it:

   ```ts
   import { createRouter } from '@axis-backstage/plugin-jira-dashboard-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return await createRouter({
       logger: env.logger,
       config: env.config,
       discovery: env.discovery,
       identity: env.identity,
       tokenManager: env.tokenManager,
     });
   }
   ```

2. Wire this into the overall backend router by adding the following to `packages/backend/src/index.ts`:

   ```ts
   import jiraDashboard from './plugins/jiraDashboard';
   ...

   async function main() {
     // Add this line under the other lines that follow the useHotMemoize pattern
    const jiraDashboardEnv = useHotMemoize(module, () => createEnv('jira-dashboard'),

     // Add this under the lines that add their routers to apiRouter
    apiRouter.use('/jira-dashboard', await jiraDashboard(jiraDashboardEnv));
   }
   ```

3. Now run `yarn start-backend` from the repo root.

4. In another terminal, run the command: `curl localhost:7007/api/jira-dashboard/health`. The request should return `{"status":"ok"}`.

### New Backend System

The Jira Dashboard backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/). Here is how you can set it up:

In your `packages/backend/src/index.ts` make the following changes:

```diff

const backend = createBackend();
+ backend.add(import('@axis-backstage/plugin-jira-dashboard-backend'));
// ... other feature additions

backend.start();
```
