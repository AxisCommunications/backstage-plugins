import fetch from 'node-fetch';
import { mockServices } from '@backstage/backend-test-utils';
import {
  getProjectInfo,
  getIssuesByFilter,
  getIssuesByComponent,
  getProjectAvatar,
  getFilterById,
  searchJira,
} from './api';
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

  const mockConfigApiUrl = mockServices.rootConfig({
    data: {
      jiraDashboard: {
        baseUrl: 'http://jira.com/',
        apiUrl: 'http://api.atlassian.com/',
        token: 'token',
        headers: {
          'Custom-Header': 'custom value',
        },
        userEmailSuffix: '@backstage.com',
      },
    },
  });

  const instanceApiUrl = JiraConfig.fromConfig(mockConfigApiUrl).getInstance();

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

  it('getProjectInfo baseUrl', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return { name: 'ppp', self: 'http://jira.com/project/ppp' };
      },
    });
    (fetch as jest.MockedFn<typeof fetch>).mockImplementation(
      () => response as any,
    );

    const jiraProject = {
      instance,
      projectKey: 'ppp',
      fullProjectKey: 'default/ppp',
    };

    const projectInfo = await getProjectInfo(jiraProject);

    expect(fetch).toHaveBeenCalledWith('http://jira.com/project/ppp', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Custom-Header': 'custom value',
        Authorization: 'token',
      },
    });

    expect(projectInfo).toEqual({
      name: 'ppp',
      self: 'http://jira.com/project/ppp',
    });
  });

  it('getProjectInfo apiUrl', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return { name: 'ppp', self: 'http://api.atlassian.com/project/ppp' };
      },
    });
    (fetch as jest.MockedFn<typeof fetch>).mockImplementation(
      () => response as any,
    );

    const jiraProject = {
      instance: instanceApiUrl,
      projectKey: 'ppp',
      fullProjectKey: 'default/ppp',
    };

    const projectInfo = await getProjectInfo(jiraProject);

    expect(fetch).toHaveBeenCalledWith('http://api.atlassian.com/project/ppp', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Custom-Header': 'custom value',
        Authorization: 'token',
      },
    });

    expect(projectInfo).toEqual({
      name: 'ppp',
      self: 'http://jira.com/project/ppp',
    });
  });

  it('getFilterById', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return { name: 'filter1' };
      },
    });
    (fetch as jest.MockedFn<typeof fetch>).mockImplementation(
      () => response as any,
    );

    const filter = await getFilterById('filter1', instance);
    const filterApiUrl = await getFilterById('filter1', instanceApiUrl);

    expect(fetch).toHaveBeenCalledWith('http://jira.com/filter/filter1', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Custom-Header': 'custom value',
        Authorization: 'token',
      },
    });

    expect(filter).toEqual({ name: 'filter1' });

    expect(fetch).toHaveBeenCalledWith(
      'http://api.atlassian.com/filter/filter1',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Custom-Header': 'custom value',
          Authorization: 'token',
        },
      },
    );

    expect(filterApiUrl).toEqual({ name: 'filter1' });
  });

  it('getIssuesByFilter baseUrl', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return {
          issues: [{ key: 'ppp-1', self: 'http://jira.com/issue/ppp-1' }],
        };
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
    ];

    const issues = await getIssuesByFilter(projects, ['ccc'], 'query');

    expect(fetch).toHaveBeenCalledWith(
      "http://jira.com/search?jql=project in ('ppp') AND component in ('ccc') AND query",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Custom-Header': 'custom value',
          Authorization: 'token',
        },
      },
    );

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/issue/ppp-1' },
    ]);
  });

  it('getIssuesByFilter apiUrl', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return {
          issues: [
            { key: 'ppp-1', self: 'http://api.atlassian.com/issue/ppp-1' },
          ],
        };
      },
    });
    (fetch as jest.MockedFn<typeof fetch>).mockImplementation(
      () => response as any,
    );

    const projects = [
      {
        instance: instanceApiUrl,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
    ];

    const issues = await getIssuesByFilter(projects, ['ccc'], 'query');

    expect(fetch).toHaveBeenCalledWith(
      "http://api.atlassian.com/search?jql=project in ('ppp') AND component in ('ccc') AND query",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Custom-Header': 'custom value',
          Authorization: 'token',
        },
      },
    );

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/issue/ppp-1' },
    ]);
  });

  it('searchJira baseUrl', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return {
          issues: [{ key: 'ppp-1', self: 'http://jira.com/issue/ppp-1' }],
        };
      },
    });
    (fetch as jest.MockedFn<typeof fetch>).mockImplementation(
      () => response as any,
    );

    const queryResults = await searchJira(instance, 'query', {});

    expect(fetch).toHaveBeenCalledWith('http://jira.com/search', {
      method: 'POST',
      body: '{"jql":"query"}',
      headers: {
        Accept: 'application/json',
        'Custom-Header': 'custom value',
        'Content-Type': 'application/json',
        Authorization: 'token',
      },
    });

    expect(queryResults).toEqual({
      issues: [{ key: 'ppp-1', self: 'http://jira.com/issue/ppp-1' }],
    });
  });

  it('searchJira apiUrl', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return {
          issues: [
            { key: 'ppp-1', self: 'http://api.atlassian.com/issue/ppp-1' },
          ],
        };
      },
    });
    (fetch as jest.MockedFn<typeof fetch>).mockImplementation(
      () => response as any,
    );

    const queryResults = await searchJira(instanceApiUrl, 'query', {});

    expect(fetch).toHaveBeenCalledWith('http://api.atlassian.com/search', {
      method: 'POST',
      body: '{"jql":"query"}',
      headers: {
        Accept: 'application/json',
        'Custom-Header': 'custom value',
        'Content-Type': 'application/json',
        Authorization: 'token',
      },
    });

    expect(queryResults).toEqual({
      issues: [{ key: 'ppp-1', self: 'http://jira.com/issue/ppp-1' }],
    });
  });

  it('getIssuesByComponent baseUrl', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return {
          issues: [{ key: 'ppp-1', self: 'http://jira.com/issue/ppp-1' }],
        };
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
      "http://jira.com/search?jql=project in ('ppp','bbb') AND component in ('ccc')",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Custom-Header': 'custom value',
          Authorization: 'token',
        },
      },
    );

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/issue/ppp-1' },
    ]);
  });

  it('getIssuesByComponent apiUrl', async () => {
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
        return {
          issues: [
            { key: 'ppp-1', self: 'http://api.atlassian.com/issue/ppp-1' },
          ],
        };
      },
    });
    (fetch as jest.MockedFn<typeof fetch>).mockImplementation(
      () => response as any,
    );

    const projects = [
      {
        instance: instanceApiUrl,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
      {
        instance: instanceApiUrl,
        fullProjectKey: 'default/bbb',
        projectKey: 'bbb',
      },
    ];

    const issues = await getIssuesByComponent(projects, 'ccc');

    expect(fetch).toHaveBeenCalledWith(
      "http://api.atlassian.com/search?jql=project in ('ppp','bbb') AND component in ('ccc')",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Custom-Header': 'custom value',
          Authorization: 'token',
        },
      },
    );

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/issue/ppp-1' },
    ]);
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
      "http://jira.com/search?jql=project in ('ppp') AND component in ('ccc')",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'token',
          'Custom-Header': 'custom value',
        },
      },
    );
    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://api.atlassian.com/issue/ppp-1' },
    ]);
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
      "http://jira.com/search?jql=project in ('ppp','bbb') AND component in ('ccc','ddd')",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'token',
          'Custom-Header': 'custom value',
        },
      },
    );
    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://api.atlassian.com/issue/ppp-1' },
    ]);
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
      "http://jira.com/search?jql=project in ('invalid') AND component in ('ccc')",
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
  it('combines jira.com/jql annotation with filter query and sends correct JQL to Jira', async () => {
    // Simulate annotation and filter
    const annotationJql = 'status = "Open"';
    const filterQuery = 'resolution = Unresolved';
    const orderBy = 'ORDER BY updated DESC';
    const combinedJql = `${filterQuery} AND (${annotationJql}) ${orderBy}`;

    // Mock Jira response
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({
        issues: [{ key: 'project-123', self: 'http://jira.com/issue/ppp-1' }],
      }),
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
    ];

    // Call getIssuesByFilter with the combined JQL
    await getIssuesByFilter(projects, ['ccc'], combinedJql);

    // Check that the correct JQL is sent to Jira
    expect(fetch).toHaveBeenCalledWith(
      "http://jira.com/search?jql=project in ('ppp') AND component in ('ccc') AND resolution = Unresolved AND (status = \"Open\") ORDER BY updated DESC",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Custom-Header': 'custom value',
          Authorization: 'token',
        },
      },
    );
  });
});
