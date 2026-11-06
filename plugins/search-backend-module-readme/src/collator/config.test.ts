import { mockServices } from '@backstage/backend-test-utils';
import { readCollatorConfigOptions, readScheduleConfigOptions } from './config';

describe('readScheduleConfigOptions', () => {
  it('returns defaults when no configuration is present', () => {
    const config = mockServices.rootConfig();
    const schedule = readScheduleConfigOptions(config);

    expect(schedule).toEqual({
      frequency: { minutes: 10 },
      timeout: { minutes: 15 },
      initialDelay: { seconds: 3 },
    });
  });

  it('reads the schedule from the search.collators.readme key', () => {
    const config = mockServices.rootConfig({
      data: {
        search: {
          collators: {
            readme: {
              schedule: {
                frequency: { minutes: 30 },
                timeout: { minutes: 10 },
              },
            },
          },
        },
      },
    });
    const schedule = readScheduleConfigOptions(config);

    expect(schedule.frequency).toEqual({ minutes: 30 });
    expect(schedule.timeout).toEqual({ minutes: 10 });
  });

  it('throws a descriptive error for invalid schedules', () => {
    const config = mockServices.rootConfig({
      data: {
        search: {
          collators: {
            readme: {
              schedule: {
                frequency: 'not a duration',
                timeout: { minutes: 10 },
              },
            },
          },
        },
      },
    });

    expect(() => readScheduleConfigOptions(config)).toThrow(
      'Invalid schedule at search.collators.readme',
    );
  });
});

describe('readCollatorConfigOptions', () => {
  it('returns defaults when no configuration is present', () => {
    const config = mockServices.rootConfig();
    const options = readCollatorConfigOptions(config);

    expect(options).toEqual({
      locationTemplate: '/catalog/:namespace/:kind/:name',
      filter: undefined,
      parallelismLimit: 10,
    });
  });

  it('reads the collator options', () => {
    const config = mockServices.rootConfig({
      data: {
        search: {
          collators: {
            readme: {
              locationTemplate: '/catalog/:kind/:namespace/:name',
              filter: { kind: 'API' },
              parallelismLimit: 25,
            },
          },
        },
      },
    });
    const options = readCollatorConfigOptions(config);

    expect(options).toEqual({
      locationTemplate: '/catalog/:kind/:namespace/:name',
      filter: { kind: 'API' },
      parallelismLimit: 25,
    });
  });
});
