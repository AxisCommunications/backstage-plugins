# Readme backend

Welcome to the readme backend plugin!

A plugin that fetch README.md files at the entity source location. The frontend plugin that displays this information is [Readme plugin](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/readme). The plugin can handle symlinks.

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
