import fetch from 'node-fetch';

import { mockServices } from '@backstage/backend-test-utils';

import { getIssuesByComponent, getProjectAvatar } from './api';
import { JiraConfig } from './config';

jest.mock('node-fetch', () => jest.fn());

describe('api', () => {
  const mockConfig = mockServices.rootConfig({
    data: {
      jiraDashboard: {
        baseUrl: 'http://jira.com/',
        token: 'token',
        headers: {
          'Custom-Header': 'custom value',
        },
        userEmailSuffix: '@backstage.com',
      },
    },
  });

  const instance = JiraConfig.fromConfig(mockConfig).getInstance();

  it('getProjectAvatar', async () => {
    await getProjectAvatar('http://jira.com/', instance);

    expect(fetch).toHaveBeenCalledWith('http://jira.com/', {
      method: 'GET',
      headers: {
        'Custom-Header': 'custom value',
        Authorization: 'token',
      },
    });
  });

  it('getIssuesByComponent', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return { issues: ['issue1'] };
      },
    });
    (fetch as jest.MockedFn<typeof fetch>).mockImplementation(
      () => response as any,
    );

    const issues = await getIssuesByComponent(
      {
        instance,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
      'ccc',
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://jira.com/search?jql=project in (ppp) AND component in ('ccc')",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Custom-Header': 'custom value',
          Authorization: 'token',
        },
      },
    );

    expect(issues).toEqual(['issue1']);
  });
});
