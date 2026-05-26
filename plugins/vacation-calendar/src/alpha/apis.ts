import { ApiBlueprint, fetchApiRef } from '@backstage/frontend-plugin-api';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { vacationCalendarApiRef } from '../api';
import { VacationCalendarApiClient } from '../api';

/**
 * @alpha
 */
export const vacationCalendarApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: vacationCalendarApiRef,
      deps: { authApi: microsoftAuthApiRef, fetchApi: fetchApiRef },
      factory: ({ authApi, fetchApi }) =>
        new VacationCalendarApiClient({ authApi, fetchApi }),
    }),
});
