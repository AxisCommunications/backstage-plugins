import schedule from './schedule.json';
import availability from './availability.json';
import { ScheduleInformation, MicrosoftCalendar } from '../../src/api/types';
import { VacationCalendarApi } from '../../src/api';

export const mockVacationCalendarApi: VacationCalendarApi = {
  async getCalendars() {
    return Promise.resolve(schedule as MicrosoftCalendar[]);
  },
  async getAvailability() {
    return Promise.resolve(availability as ScheduleInformation[]);
  },
};
