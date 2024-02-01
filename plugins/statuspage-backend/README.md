# Statuspage backend

Welcome to the Statuspage backend plugin!

The plugin retrieves component status information the statuspage.io api.

## Setup

The following sections will help you get the Readme Backend plugin setup and running.

### Installation

Install the plugin by following the example below:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @axis-backstage/plugin-statuspage-backend
```

### Integrating

Here's how to get the backend plugin up and running:

1. Create a new file named `packages/backend/src/plugins/statuspage.ts`, and add the following to it:

   ```ts
    import { PluginEnvironment } from '../types';
    import { createRouter } from '@internal/plugin-statuspage-backend';
    import { Router } from 'express';

    export default async function createPlugin(
        env: PluginEnvironment,
    ): Promise<Router> {
        return await createRouter({
            logger: env.logger,
            config: env.config,
        });
    }
   ```

2. Wire this into the overall backend router by adding the following to `packages/backend/src/index.ts`:

   ```ts
   import statuspage from './plugins/statuspage';
   ...

   async function main() {
     // Add this line under the other lines that follow the useHotMemoize pattern
    const statuspageEnv = useHotMemoize(module, () => createEnv('statuspage'));

    ....

     // Add this under the lines that add their routers to apiRouter
    apiRouter.use('/statuspage', authMiddleware, await statuspage(statuspageEnv));
   }
   ```
