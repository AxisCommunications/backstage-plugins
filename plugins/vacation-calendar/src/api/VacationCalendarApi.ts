import { createApiRef } from '@backstage/core-plugin-api';
import type { MicrosoftCalendar, ScheduleInformation } from './types';

/**
 * The apiref for the VacationCalendar plugin.
 *
 * @public
 */
export const vacationCalendarApiRef = createApiRef<VacationCalendarApi>({
  id: 'plugin.vacation-calendar.service',
});

/**
 * The definition for the VacationCalendar api.
 *
 * @public
 */
export interface VacationCalendarApi {
  /**
   * Fetches schedule items for users
   */
  getCalendars(): Promise<MicrosoftCalendar[]>;
  /**
   * Fetches Microsoft calendars
   */
  getAvailability(
    params: {
      users: string[];
      startDateTime: string;
      endDateTime: string;
    },
    headers: {
      [x: string]: any;
    },
  ): Promise<ScheduleInformation[]>;
}
