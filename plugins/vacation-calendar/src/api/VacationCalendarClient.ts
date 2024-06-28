import { OAuthApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import type { ScheduleInformation, MicrosoftCalendar } from './types';

const getAvailabilityBody = ({
  users,
  startDateTime,
  endDateTime,
}: {
  users: string[];
  startDateTime: string;
  endDateTime: string;
}) => ({
  Schedules: users,
  StartTime: {
    dateTime: startDateTime,
    timeZone: 'Europe/Paris',
  },
  EndTime: {
    dateTime: endDateTime,
    timeZone: 'Europe/Paris',
  },
  availabilityViewInterval: '1440',
});

/**
 * The client implementation for the frontend api.
 *
 * @public
 */
export class VacationCalendarApiClient {
  private readonly authApi: OAuthApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { authApi: OAuthApi; fetchApi: FetchApi }) {
    this.authApi = options.authApi;
    this.fetchApi = options.fetchApi;
  }

  private async get<T>(
    path: string,
    params: { [key in string]: any } = {},
    headers?: any,
  ): Promise<T> {
    const query = new URLSearchParams(params);
    const url = new URL(
      `${path}?${query.toString()}`,
      'https://graph.microsoft.com',
    );
    const token = await this.authApi.getAccessToken();
    let temp: any = {};

    if (headers && typeof headers === 'object') {
      temp = {
        ...headers,
      };
    }

    if (token) {
      temp.Authorization = `Bearer ${token}`;
    }

    const response = await this.fetchApi.fetch(url.toString(), {
      headers: temp,
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }

  private async post<T>(path: string, body: any, headers?: any): Promise<T> {
    const url = new URL(path, 'https://graph.microsoft.com');
    const token = await this.authApi.getAccessToken();
    let temp: any = {};

    if (headers && typeof headers === 'object') {
      temp = {
        ...headers,
      };
    }

    if (token) {
      temp.Authorization = `Bearer ${token}`;
    }
    temp['Content-type'] = 'application/json';

    const response = await this.fetchApi.fetch(url.toString(), {
      method: 'POST',
      headers: temp,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Fetches Microsoft calendars
   *
   * @returns the MicrosoftValendar objects
   */
  async getCalendars(): Promise<MicrosoftCalendar[]> {
    const data = await this.get<{
      id: string;
      value: MicrosoftCalendar[];
    }>('v1.0/me/calendars');
    return data.value;
  }

  /**
   * Fetches schedule items for users
   *
   * @param users - list of users
   * @param startDateTime - string with start date
   * @param endDateTime - string with end date
   * @returns Microsoft ScheduleInformation items
   */
  async getAvailability(
    params: {
      users: string[];
      startDateTime: string;
      endDateTime: string;
    },
    headers: { [key in string]: any },
  ): Promise<ScheduleInformation[]> {
    const data = await this.post<{
      id: string;
      value: ScheduleInformation[];
    }>(
      `v1.0/me/calendar/getschedule`,
      getAvailabilityBody({ ...params }),
      headers,
    );
    return data.value;
  }
}
