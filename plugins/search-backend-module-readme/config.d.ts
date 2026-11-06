import { SchedulerServiceTaskScheduleDefinitionConfig } from '@backstage/backend-plugin-api';
import { EntityFilterQuery } from '@backstage/catalog-client';

export interface Config {
  search?: {
    collators?: {
      /**
       * Configuration options for the README collator, which indexes the
       * README files of catalog entities.
       */
      readme?: {
        /**
         * Schedule for the README collator, see
         * https://backstage.io/docs/features/utility-functions/#taskschedule-definition.
         *
         * The collator fetches README content through the readme backend
         * plugin, whose cache TTL (`readme.cacheTtl`) also defaults to one
         * hour. Keep the schedule frequency shorter than the cache TTL so
         * that most collator requests are served from the backend's cache
         * instead of refetching every README from its source. This matters
         * in particular for rate limited SCM providers.
         *
         * @default { frequency: { minutes: 10 }, timeout: { minutes: 15 }, initialDelay: { seconds: 3 } }
         */
        schedule?: SchedulerServiceTaskScheduleDefinitionConfig;
        /**
         * Filters used to restrict the set of entities whose README files are
         * indexed, on the same format as the `filter` parameter of the catalog
         * `queryEntities` endpoint.
         */
        filter?: EntityFilterQuery;
        /**
         * The template used to generate the location of each indexed document.
         *
         * @default '/catalog/:namespace/:kind/:name'
         */
        locationTemplate?: string;
        /**
         * The number of README files to fetch from the readme backend in
         * parallel.
         *
         * @default 10
         */
        parallelismLimit?: number;
      };
    };
  };
}
