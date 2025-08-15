import { mockServices } from '@backstage/backend-test-utils';

import { getCacheTtl } from './config';

describe('getCacheTtl', () => {
  it('should return default TTL when cache.ttl is not configured', () => {
    const mockConfig = mockServices.rootConfig({
      data: {},
    });

    const result = getCacheTtl(mockConfig);

    expect(result).toBe(3_600_000); // 1 hour in milliseconds
  });

  it('should return default TTL when readme config section exists but no ttl key', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        readme: {},
      },
    });

    const result = getCacheTtl(mockConfig);

    expect(result).toBe(3_600_000); // 1 hour in milliseconds
  });

  it('should return configured TTL in seconds', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        readme: {
          cacheTtl: { seconds: 1800 }, // 30 minutes
        },
      },
    });

    const result = getCacheTtl(mockConfig);

    expect(result).toBe(1_800_000); // 30 minutes in milliseconds
  });

  it('should return configured TTL in minutes', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        readme: {
          cacheTtl: { minutes: 10 },
        },
      },
    });

    const result = getCacheTtl(mockConfig);

    expect(result).toBe(600_000); // 10 minutes in milliseconds
  });

  it('should return configured TTL in hours', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        readme: {
          cacheTtl: { hours: 2 },
        },
      },
    });

    const result = getCacheTtl(mockConfig);

    expect(result).toBe(7_200_000); // 2 hours in milliseconds
  });

  it('should return configured TTL as a string value (interpreted as milliseconds)', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        readme: {
          cacheTtl: '4w',
        },
      },
    });

    const result = getCacheTtl(mockConfig);

    expect(result).toBe(2419200000); // 4 weeks in milliseconds
  });

  it('should handle complex duration configuration', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        readme: {
          cacheTtl: {
            hours: 1,
            minutes: 30,
            seconds: 45,
          },
        },
      },
    });

    const result = getCacheTtl(mockConfig);

    expect(result).toBe(5_445_000); // 1h 30m 45s in milliseconds
  });
});
