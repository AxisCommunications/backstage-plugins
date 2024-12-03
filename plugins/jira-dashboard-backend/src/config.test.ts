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

  it('should handle multi-instance config', () => {
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
});
