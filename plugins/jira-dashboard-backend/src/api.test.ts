import fetch from 'node-fetch';
import { mockServices } from '@backstage/backend-test-utils';
import { getIssuesByComponent, getProjectAvatar } from './api';
import { JiraConfig } from './config';
import { JiraProject } from './lib';

jest.mock('node-fetch', () => jest.fn());
afterEach(() => {
  jest.clearAllMocks();
});

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

    const projects = [
      {
        instance,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
      {
        instance,
        fullProjectKey: 'default/bbb',
        projectKey: 'bbb',
      },
    ];

    const issues = await getIssuesByComponent(projects, 'ccc');

    expect(fetch).toHaveBeenCalledWith(
      "http://jira.com/search?jql=project in (ppp,bbb) AND component in ('ccc')",
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
  it('should handle no projects gracefully', async () => {
    const projects: JiraProject[] = [];
    const issues = await getIssuesByComponent(projects, 'ccc');

    expect(fetch).not.toHaveBeenCalled();
    expect(issues).toEqual([]);
  });
  it('should handle a single project correctly', async () => {
    const projects = [
      {
        instance,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
    ];
    const issues = await getIssuesByComponent(projects, 'ccc');

    expect(fetch).toHaveBeenCalledWith(
      "http://jira.com/search?jql=project in (ppp) AND component in ('ccc')",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'token',
          'Custom-Header': 'custom value',
        },
      },
    );
    expect(issues).toEqual(['issue1']);
  });
  it('should handle multiple components correctly', async () => {
    const projects = [
      {
        instance,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
      {
        instance,
        fullProjectKey: 'default/bbb',
        projectKey: 'bbb',
      },
    ];
    const issues = await getIssuesByComponent(projects, 'ccc,ddd');

    expect(fetch).toHaveBeenCalledWith(
      "http://jira.com/search?jql=project in (ppp,bbb) AND component in ('ccc','ddd')",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'token',
          'Custom-Header': 'custom value',
        },
      },
    );
    expect(issues).toEqual(['issue1']);
  });
  it('should handle invalid project keys', async () => {
    const projects = [
      {
        instance,
        fullProjectKey: 'default/invalid',
        projectKey: 'invalid',
      },
    ];

    // Mock the fetch call to simulate a Jira response for an invalid project key
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            errorMessages: [
              "The value 'invalid' does not exist for the field 'project'",
            ],
          }),
      }),
    );

    const issues = await getIssuesByComponent(projects, 'ccc');

    expect(fetch).toHaveBeenCalledWith(
      "http://jira.com/search?jql=project in (invalid) AND component in ('ccc')",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'token',
          'Custom-Header': 'custom value',
        },
      },
    );
    expect(issues).toEqual([]);
  });
});
