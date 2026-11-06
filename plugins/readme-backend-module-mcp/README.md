# Readme Backend Module for MCP Actions

A backend module for the readme plugin that makes README content available to
AI systems through the
[Actions Registry](https://backstage.io/docs/ai/well-known-actions/) and the
[MCP actions backend](https://backstage.io/docs/ai/mcp-actions/) plugin.

## Overview

The module registers a read-only `get-readme-content` action that retrieves
the README file of a catalog entity. When the MCP actions backend plugin is
installed, the action is exposed as an MCP tool that AI assistants such as
Claude, Cursor, or VS Code can use to answer questions about your services
from their README files.

The action fetches the content from the readme backend plugin's HTTP API, so
it shares the plugin's configuration (e.g. `readme.fileNames`,
`readme.cacheTtl`) and cache with the READMEs displayed on entity pages.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @axis-backstage/plugin-readme-backend-module-mcp
```

Then add the module to your backend, making sure that the readme backend
plugin and the MCP actions backend plugin are installed as well:

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-mcp-actions-backend'));
backend.add(import('@axis-backstage/plugin-readme-backend'));
backend.add(import('@axis-backstage/plugin-readme-backend-module-mcp'));
// ...
backend.start();
```

## Usage

The action is exposed on the default MCP server at
`/api/mcp-actions/v1`, with the tool name `readme.get-readme-content` when
namespaced tool names are enabled (the default).

Example MCP client configuration:

```json
{
  "mcpServers": {
    "backstage": {
      "url": "http://localhost:7007/api/mcp-actions/v1",
      "headers": {
        "Authorization": "Bearer ${MCP_TOKEN}"
      }
    }
  }
}
```

### Input

| Field       | Type   | Description                                                                                                     |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| `entityRef` | string | Entity reference, e.g. `component:default/my-service`. Kind defaults to `Component` and namespace to `default`. |

### Output

| Field         | Type   | Description                                     |
| ------------- | ------ | ----------------------------------------------- |
| `entityRef`   | string | The full entity reference                       |
| `content`     | string | The README file content                         |
| `contentType` | string | MIME type, e.g. `text/markdown` or `text/plain` |

## Configuration

The module requires no configuration of its own. See the
[readme backend](../readme-backend) documentation for the README file lookup
configuration, and the
[MCP actions documentation](https://backstage.io/docs/ai/mcp-actions/) for
authentication and server configuration.
