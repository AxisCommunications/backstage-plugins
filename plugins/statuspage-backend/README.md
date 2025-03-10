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

Here's how to get the backend plugin up and running. In your `packages/backend/src/index.ts` make
the following changes:

```diff

const backend = createBackend();
+ backend.add(import('@axis-backstage/plugin-statuspage-backend'));
// ... other feature additions

backend.start();
```
