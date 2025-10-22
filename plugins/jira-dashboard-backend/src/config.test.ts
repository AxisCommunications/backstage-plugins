import { mockServices } from '@backstage/backend-test-utils';

import { JiraConfig } from './config';

describe('config', () => {
  it('should handle a regular config', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com',
          token: 'token',
          userEmailSuffix: '@backstage.com',
        },
      },
    });
    const instance = JiraConfig.fromConfig(mockConfig).getInstance();
    expect(instance.baseUrl).toBe('http://jira.com');
    expect(instance.token).toBe('token');
    expect(instance.headers).toEqual({});
    expect(instance.userEmailSuffix).toBe('@backstage.com');
  });

  it('should handle a config with apiUrl', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com',
          apiUrl: 'http://api.atlassian.com',
          token: 'token',
          userEmailSuffix: '@backstage.com',
        },
      },
    });
    const instance = JiraConfig.fromConfig(mockConfig).getInstance();
    expect(instance.baseUrl).toBe('http://jira.com');
    expect(instance.apiUrl).toBe('http://api.atlassian.com');
    expect(instance.token).toBe('token');
    expect(instance.headers).toEqual({});
    expect(instance.userEmailSuffix).toBe('@backstage.com');
  });

  it('should handle custom headers', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com',
          token: 'token',
          headers: {
            'Custom-Header': 'custom value',
          },
          userEmailSuffix: '@backstage.com',
        },
      },
    });
    const instance = JiraConfig.fromConfig(mockConfig).getInstance();
    expect(instance.baseUrl).toBe('http://jira.com');
    expect(instance.token).toBe('token');
    expect(instance.headers).toEqual({ 'Custom-Header': 'custom value' });
    expect(instance.userEmailSuffix).toBe('@backstage.com');
  });

  it('should handle useApiV3 in multi-instance config', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          instances: [
            {
              name: 'default',
              baseUrl: 'http://jira.com',
              token: 'token',
              userEmailSuffix: '@backstage.com',
            },
            {
              name: 'other',
              baseUrl: 'http://jira2.com',
              token: 'token2',
              userEmailSuffix: '@backstage2.com',
            },
          ],
        },
      },
    });
    const instance = JiraConfig.fromConfig(mockConfig).getInstance();
    expect(instance.baseUrl).toBe('http://jira.com');
    expect(instance.token).toBe('token');
    expect(instance.headers).toEqual({});
    expect(instance.userEmailSuffix).toBe('@backstage.com');
    expect(instance).toEqual(
      JiraConfig.fromConfig(mockConfig).getInstance('default'),
    );

    const instance2 = JiraConfig.fromConfig(mockConfig).getInstance('other');
    expect(instance2.baseUrl).toBe('http://jira2.com');
    expect(instance2.token).toBe('token2');
    expect(instance2.headers).toEqual({});
    expect(instance2.userEmailSuffix).toBe('@backstage2.com');
  });

  it('should handle multi-instance custom headers', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          instances: [
            {
              name: 'default',
              baseUrl: 'http://jira.com',
              token: 'token',
              headers: {
                'Custom-Header': 'custom value',
              },
              userEmailSuffix: '@backstage.com',
            },
            {
              name: 'other',
              baseUrl: 'http://jira2.com',
              token: 'token2',
              headers: {
                'Other-Header': 'other value',
              },
              userEmailSuffix: '@backstage2.com',
            },
          ],
        },
      },
    });
    const instance = JiraConfig.fromConfig(mockConfig).getInstance();
    expect(instance.baseUrl).toBe('http://jira.com');
    expect(instance.token).toBe('token');
    expect(instance.headers).toEqual({ 'Custom-Header': 'custom value' });
    expect(instance.userEmailSuffix).toBe('@backstage.com');

    const instance2 = JiraConfig.fromConfig(mockConfig).getInstance('other');
    expect(instance2.baseUrl).toBe('http://jira2.com');
    expect(instance2.token).toBe('token2');
    expect(instance2.headers).toEqual({ 'Other-Header': 'other value' });
    expect(instance2.userEmailSuffix).toBe('@backstage2.com');
  });

  it('should handle defaultFilters config', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          instances: [
            {
              name: 'default',
              baseUrl: 'http://jira.com',
              token: 'token',
              defaultFilters: [
                {
                  name: 'My Open Bugs',
                  shortName: 'MyBugs',
                  query: 'type = Bug AND resolution = Unresolved',
                },
                {
                  name: 'High Priority Issues',
                  shortName: 'HighPrio',
                  query: 'priority = "High"',
                },
              ],
            },
          ],
        },
      },
    });

    const jiraConfig = JiraConfig.fromConfig(mockConfig);
    const instance = jiraConfig.getInstance();

    expect(instance.defaultFilters).toEqual([
      {
        name: 'My Open Bugs',
        shortName: 'MyBugs',
        query: 'type = Bug AND resolution = Unresolved',
      },
      {
        name: 'High Priority Issues',
        shortName: 'HighPrio',
        query: 'priority = "High"',
      },
    ]);
  });

  it('should default cacheTtl to 1 hour when not specified', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com',
          token: 'token',
          userEmailSuffix: '@backstage.com',
        },
      },
    });
    const instance = JiraConfig.fromConfig(mockConfig).getInstance();
    expect(instance.cacheTtl).toBe(3_600_000); // 1 hour in milliseconds
  });

  it('should handle cacheTtl set to custom duration in single instance config', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com',
          token: 'token',
          userEmailSuffix: '@backstage.com',
          cacheTtl: '30m',
        },
      },
    });
    const instance = JiraConfig.fromConfig(mockConfig).getInstance();
    expect(instance.cacheTtl).toBe(1_800_000); // 30 minutes in milliseconds
  });

  it('should handle cacheTtl in multi-instance config', () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          instances: [
            {
              name: 'default',
              baseUrl: 'http://jira.com',
              token: 'token',
              userEmailSuffix: '@backstage.com',
              cacheTtl: '10m',
            },
            {
              name: 'other',
              baseUrl: 'http://jira2.com',
              token: 'token2',
              userEmailSuffix: '@backstage2.com',
              cacheTtl: '2h',
            },
            {
              name: 'third',
              baseUrl: 'http://jira3.com',
              token: 'token3',
              userEmailSuffix: '@backstage3.com',
              // cacheTtl not specified, should default to 1 hour
            },
          ],
        },
      },
    });

    const jiraConfig = JiraConfig.fromConfig(mockConfig);

    const defaultInstance = jiraConfig.getInstance('default');
    expect(defaultInstance.cacheTtl).toBe(600_000); // 10 minutes

    const otherInstance = jiraConfig.getInstance('other');
    expect(otherInstance.cacheTtl).toBe(7_200_000); // 2 hours

    const thirdInstance = jiraConfig.getInstance('third');
    expect(thirdInstance.cacheTtl).toBe(3_600_000); // 1 hour (default)
  });
});
