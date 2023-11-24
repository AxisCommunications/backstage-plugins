# Readme backend

Welcome to the readme backend plugin!

The plugin retrieves README.md files from the entity source location. The corresponding frontend plugin responsible for displaying this information is the [Readme plugin](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/readme).

The plugin searches for a README file in the entity source location with any of the following file types:

```ts
{ name: 'README', type: 'text/plain' },
{ name: 'README.md', type: 'text/markdown' },
{ name: 'README.rst', type: 'text/plain' },
{ name: 'README.txt', type: 'text/plain' },
{ name: 'README.MD', type: 'text/markdown' },
```

The plugin can also handle symlinks.

## Setup

The following sections will help you get the Readme Backend plugin setup and running.

### Installation

Install the plugin by following the example below:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @axis-backstage/plugin-readme-backend
```

### Integrating

Here's how to get the backend plugin up and running:

1. Create a new file named `packages/backend/src/plugins/readme.ts`, and add the following to it:

   ```ts
   import { createRouter } from '@axis-backstage/plugin-readme-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';

   eexport default async function createPlugin(
   env: PluginEnvironment,
   ): Promise<Router> {
   return await createRouter({
    logger: env.logger,
    config: env.config,
    reader: env.reader,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
   });
   }
   ```

2. Wire this into the overall backend router by adding the following to `packages/backend/src/index.ts`:

   ```ts
   import readme from './plugins/readme';
   ...

   async function main() {
     // Add this line under the other lines that follow the useHotMemoize pattern
    const readmeEnv = useHotMemoize(module, () => createEnv('readme'),

     // Add this under the lines that add their routers to apiRouter
    apiRouter.use('/readme', await readme(readmeEnv));
   }
   ```

3. Now run `yarn start-backend` from the repo root.

4. In another terminal, run the command: `curl localhost:7007/api/readme/health`. The request should return `{"status":"ok"}`.

### New Backend System

The Readme backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/). Here is how you can set it up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
+ import { readmePlugin } from '@axis-backstage/readme-backend';

const backend = createBackend();
+ backend.add(readmePlugin());
// ... other feature additions

backend.start();
```

### Troubleshooting

If the backend fails to provide README content for an entity, it could be due to several reasons.

#### No Integration Found for Entity

This error message indicates that there is no current integration with the external provider where the README file is located, such as GitHub, GitLab, or Gerrit. When the integration is missing, the backend does not have permission to access the README content.

To resolve this issue, set up the integration for the external provider where the README file is located. You can find more information about Backstage integrations in the [Backstage upstream documentation](https://backstage.io/docs/integrations/).

#### Not a Valid Location for Source Target

This error means that the entity source location cannot be found or is not a valid URL. The `entity source location` is always the same directory as the catalog-info.yaml file.

To debug this error, ensure that the entity source location is valid for the current entity. You can find the entity source location in the entity's catalog-info.yaml file. See the example below:

```yaml
annotations:
  backstage.io/source-location: url:https://github.com/AxisCommunications/backstage-plugins/blob/main/
```

#### README Not Found for Entity

This error indicates that no README, README.md, README.rst, README.txt, or README.MD file was found for that entity. To resolve this error, ensure that there is a README file located in the entity source location with one of the following formats: **md**, **rst**, or **txt**.
