## API Report File for "@axis-backstage/plugin-statuspage-backend"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { BackendFeature } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';

// @public
export function createRouter(options: RouterOptions): Promise<express.Router>;

// @public
export interface RouterOptions {
  config: Config;
  logger: Logger;
}

// @public
const statuspagePlugin: () => BackendFeature;
export default statuspagePlugin;
```
