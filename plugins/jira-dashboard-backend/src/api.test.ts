import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import {
  getProjectInfo,
  getIssuesByFilter,
  getIssuesByComponent,
  getProjectAvatar,
  getFilterById,
  searchJira,
  getIssueByKey,
} from './api';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { JiraConfig } from './config';
import { JiraProject } from './lib';

describe('api', () => {
  const mswServer = setupServer();
  registerMswTestHooks(mswServer);

  const mockConfig = mockServices.rootConfig({
    data: {
      jiraDashboard: {
        baseUrl: 'http://jira.com/rest/api/2/',
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
        baseUrl: 'http://jira.com/rest/api/2/',
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
    let requestReceived = false;
    mswServer.use(
      http.get('http://jira.com/rest/api/2/', ({ request }) => {
        requestReceived = true;
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await getProjectAvatar('http://jira.com/rest/api/2/', instance);
    expect(requestReceived).toBe(true);
  });

  it('getProjectInfo baseUrl', async () => {
    mswServer.use(
      http.get('http://jira.com/rest/api/2/project/ppp', ({ request }) => {
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          name: 'ppp',
          self: 'http://jira.com/rest/api/2/project/ppp',
        });
      }),
    );

    const jiraProject = {
      instance,
      projectKey: 'ppp',
      fullProjectKey: 'default/ppp',
    };

    const projectInfo = await getProjectInfo(jiraProject);

    expect(projectInfo).toEqual({
      name: 'ppp',
      self: 'http://jira.com/rest/api/2/project/ppp',
    });
  });

  it('getProjectInfo apiUrl', async () => {
    mswServer.use(
      http.get('http://api.atlassian.com/project/ppp', ({ request }) => {
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          name: 'ppp',
          self: 'http://api.atlassian.com/project/ppp',
        });
      }),
    );

    const jiraProject = {
      instance: instanceApiUrl,
      projectKey: 'ppp',
      fullProjectKey: 'default/ppp',
    };

    const projectInfo = await getProjectInfo(jiraProject);

    expect(projectInfo).toEqual({
      name: 'ppp',
      self: 'http://jira.com/rest/api/2/project/ppp',
    });
  });

  it('getFilterById', async () => {
    mswServer.use(
      http.get('http://jira.com/rest/api/2/filter/filter1', ({ request }) => {
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({ name: 'filter1' });
      }),
      http.get('http://api.atlassian.com/filter/filter1', ({ request }) => {
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({ name: 'filter1' });
      }),
    );

    const filter = await getFilterById('filter1', instance);
    expect(filter).toEqual({ name: 'filter1' });

    const filterApiUrl = await getFilterById('filter1', instanceApiUrl);
    expect(filterApiUrl).toEqual({ name: 'filter1' });
  });

  it('getIssueByKey', async () => {
    mswServer.use(
      http.get('http://jira.com/rest/api/2/issue/TEST-123', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('fields')).toBe('summary,description');
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          key: 'TEST-123',
          self: 'http://jira.com/rest/api/2/issue/TEST-123',
          fields: {
            summary: 'Test issue summary',
            description: 'This is a test issue description',
          },
        });
      }),
    );

    const issue = await getIssueByKey('TEST-123', instance);
    expect(issue).toEqual({
      key: 'TEST-123',
      self: 'http://jira.com/rest/api/2/issue/TEST-123',
      fields: {
        summary: 'Test issue summary',
        description: 'This is a test issue description',
      },
    });
  });

  it('getIssuesByFilter baseUrl', async () => {
    mswServer.use(
      http.get('http://jira.com/rest/api/2/search', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('jql')).toBe(
          "project in ('ppp') AND component in ('ccc') AND query",
        );
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          issues: [
            { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
          ],
        });
      }),
    );

    const projects = [
      {
        instance,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
    ];

    const issues = await getIssuesByFilter(projects, ['ccc'], 'query');

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
    ]);
  });

  it('getIssuesByFilter apiUrl', async () => {
    mswServer.use(
      http.get('http://api.atlassian.com/search', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('jql')).toBe(
          "project in ('ppp') AND component in ('ccc') AND query",
        );
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          issues: [
            { key: 'ppp-1', self: 'http://api.atlassian.com/issue/ppp-1' },
          ],
        });
      }),
    );

    const projects = [
      {
        instance: instanceApiUrl,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
    ];

    const issues = await getIssuesByFilter(projects, ['ccc'], 'query');

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
    ]);
  });

  it('searchJira baseUrl', async () => {
    mswServer.use(
      http.post('http://jira.com/rest/api/2/search', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ jql: 'query' });
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Content-Type')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          issues: [
            { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
          ],
        });
      }),
    );

    const queryResults = await searchJira(instance, 'query', {});

    expect(queryResults).toEqual({
      issues: [
        { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
      ],
    });
  });

  it('searchJira apiUrl', async () => {
    mswServer.use(
      http.post('http://api.atlassian.com/search', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ jql: 'query' });
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Content-Type')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          issues: [
            { key: 'ppp-1', self: 'http://api.atlassian.com/issue/ppp-1' },
          ],
        });
      }),
    );

    const queryResults = await searchJira(instanceApiUrl, 'query', {});

    expect(queryResults).toEqual({
      issues: [
        { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
      ],
    });
  });

  it('searchJira with useApiV3 baseUrl', async () => {
    const mockConfigV3 = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com/rest/api/3/',
          token: 'token',
          headers: {
            'Custom-Header': 'custom value',
          },
          userEmailSuffix: '@backstage.com',
          useApiV3: true,
        },
      },
    });

    const instanceV3 = JiraConfig.fromConfig(mockConfigV3).getInstance();

    mswServer.use(
      http.post(
        'http://jira.com/rest/api/3/search/jql',
        async ({ request }) => {
          const body = await request.json();
          expect(body).toEqual({ jql: 'query' });
          expect(request.headers.get('Accept')).toBe('application/json');
          expect(request.headers.get('Custom-Header')).toBe('custom value');
          expect(request.headers.get('Content-Type')).toBe('application/json');
          expect(request.headers.get('Authorization')).toBe('token');
          return HttpResponse.json({
            issues: [
              { key: 'ppp-1', self: 'http://jira.com/rest/api/3/issue/ppp-1' },
            ],
          });
        },
      ),
    );

    const queryResults = await searchJira(instanceV3, 'query', {});

    expect(queryResults).toEqual({
      issues: [
        { key: 'ppp-1', self: 'http://jira.com/rest/api/3/issue/ppp-1' },
      ],
    });
  });

  it('searchJira with useApiV3 and custom fields', async () => {
    const mockConfigV3 = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com/rest/api/3/',
          token: 'token',
          headers: {
            'Custom-Header': 'custom value',
          },
          userEmailSuffix: '@backstage.com',
          useApiV3: true,
        },
      },
    });

    const instanceV3 = JiraConfig.fromConfig(mockConfigV3).getInstance();

    mswServer.use(
      http.post(
        'http://jira.com/rest/api/3/search/jql',
        async ({ request }) => {
          const body = await request.json();
          expect(body).toEqual({
            jql: 'query',
            fields: ['key', 'summary'],
            maxResults: 50,
          });
          expect(request.headers.get('Accept')).toBe('application/json');
          expect(request.headers.get('Custom-Header')).toBe('custom value');
          expect(request.headers.get('Content-Type')).toBe('application/json');
          expect(request.headers.get('Authorization')).toBe('token');
          return HttpResponse.json({
            issues: [
              { key: 'ppp-1', self: 'http://jira.com/rest/api/3/issue/ppp-1' },
            ],
          });
        },
      ),
    );

    const queryResults = await searchJira(instanceV3, 'query', {
      fields: ['key', 'summary'],
      maxResults: 50,
    });

    expect(queryResults).toEqual({
      issues: [
        { key: 'ppp-1', self: 'http://jira.com/rest/api/3/issue/ppp-1' },
      ],
    });
  });

  it('searchJira with useApiV3 apiUrl', async () => {
    const mockConfigV3ApiUrl = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com/rest/api/3/',
          apiUrl: 'http://api.atlassian.com/',
          token: 'token',
          headers: {
            'Custom-Header': 'custom value',
          },
          userEmailSuffix: '@backstage.com',
          useApiV3: true,
        },
      },
    });

    const instanceV3ApiUrl =
      JiraConfig.fromConfig(mockConfigV3ApiUrl).getInstance();

    mswServer.use(
      http.post('http://api.atlassian.com/search/jql', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ jql: 'query' });
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Content-Type')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          issues: [
            { key: 'ppp-1', self: 'http://api.atlassian.com/issue/ppp-1' },
          ],
        });
      }),
    );

    const queryResults = await searchJira(instanceV3ApiUrl, 'query', {});

    expect(queryResults).toEqual({
      issues: [
        { key: 'ppp-1', self: 'http://jira.com/rest/api/3/issue/ppp-1' },
      ],
    });
  });

  it('searchJira with useApiV3 and all search options', async () => {
    const mockConfigV3 = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com/rest/api/3/',
          token: 'token',
          headers: {
            'Custom-Header': 'custom value',
          },
          userEmailSuffix: '@backstage.com',
          useApiV3: true,
        },
      },
    });

    const instanceV3 = JiraConfig.fromConfig(mockConfigV3).getInstance();

    mswServer.use(
      http.post(
        'http://jira.com/rest/api/3/search/jql',
        async ({ request }) => {
          const body = await request.json();
          expect(body).toEqual({
            jql: 'project = TEST',
            expand: ['names', 'schema'],
            fields: ['key', 'summary', 'status'],
            fieldsByKey: true,
            properties: ['prop1', 'prop2'],
            startAt: 0,
            maxResults: 100,
            validateQuery: 'strict',
          });
          expect(request.headers.get('Accept')).toBe('application/json');
          expect(request.headers.get('Custom-Header')).toBe('custom value');
          expect(request.headers.get('Content-Type')).toBe('application/json');
          expect(request.headers.get('Authorization')).toBe('token');
          return HttpResponse.json({
            issues: [
              {
                key: 'TEST-1',
                self: 'http://jira.com/rest/api/3/issue/TEST-1',
              },
            ],
            total: 1,
            startAt: 0,
            maxResults: 100,
          });
        },
      ),
    );

    const searchOptions = {
      expand: ['names', 'schema'],
      fields: ['key', 'summary', 'status'],
      fieldsByKey: true,
      properties: ['prop1', 'prop2'],
      startAt: 0,
      maxResults: 100,
      validateQuery: 'strict',
    };

    const queryResults = await searchJira(
      instanceV3,
      'project = TEST',
      searchOptions,
    );

    expect(queryResults).toEqual({
      issues: [
        { key: 'TEST-1', self: 'http://jira.com/rest/api/3/issue/TEST-1' },
      ],
      total: 1,
      startAt: 0,
      maxResults: 100,
    });
  });

  it('getIssuesByComponent baseUrl', async () => {
    mswServer.use(
      http.get('http://jira.com/rest/api/2/search', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('jql')).toBe(
          "project in ('ppp','bbb') AND component in ('ccc')",
        );
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          issues: [
            { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
          ],
        });
      }),
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

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
    ]);
  });

  it('getIssuesByComponent apiUrl', async () => {
    mswServer.use(
      http.get('http://api.atlassian.com/search', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('jql')).toBe(
          "project in ('ppp','bbb') AND component in ('ccc')",
        );
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          issues: [
            { key: 'ppp-1', self: 'http://api.atlassian.com/issue/ppp-1' },
          ],
        });
      }),
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

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
    ]);
  });

  it('should handle no projects gracefully', async () => {
    const projects: JiraProject[] = [];
    const issues = await getIssuesByComponent(projects, 'ccc');

    expect(issues).toEqual([]);
  });

  it('should handle a single project correctly', async () => {
    mswServer.use(
      http.get('http://jira.com/rest/api/2/search', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('jql')).toBe(
          "project in ('ppp') AND component in ('ccc')",
        );
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBe('token');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        return HttpResponse.json({
          issues: [
            { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
          ],
        });
      }),
    );

    const projects = [
      {
        instance,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
    ];
    const issues = await getIssuesByComponent(projects, 'ccc');

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
    ]);
  });

  it('should handle multiple components correctly', async () => {
    mswServer.use(
      http.get('http://jira.com/rest/api/2/search', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('jql')).toBe(
          "project in ('ppp','bbb') AND component in ('ccc','ddd')",
        );
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBe('token');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        return HttpResponse.json({
          issues: [
            { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
          ],
        });
      }),
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
    const issues = await getIssuesByComponent(projects, 'ccc,ddd');

    expect(issues).toEqual([
      { key: 'ppp-1', self: 'http://jira.com/rest/api/2/issue/ppp-1' },
    ]);
  });

  it('should handle invalid project keys', async () => {
    mswServer.use(
      http.get('http://jira.com/rest/api/2/search', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('jql')).toBe(
          "project in ('invalid') AND component in ('ccc')",
        );
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBe('token');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        throw new Error(
          "The value 'invalid' does not exist for the field 'project'",
        );
      }),
    );

    const projects = [
      {
        instance,
        fullProjectKey: 'default/invalid',
        projectKey: 'invalid',
      },
    ];

    const issues = await getIssuesByComponent(projects, 'ccc');
    expect(issues).toEqual([]);
  });
  it('combines jira.com/jql annotation with filter query and sends correct JQL to Jira', async () => {
    // Simulate annotation and filter
    const annotationJql = 'status = "Open"';
    const filterQuery = 'resolution = Unresolved';
    const orderBy = 'ORDER BY updated DESC';
    const combinedJql = `${filterQuery} AND (${annotationJql}) ${orderBy}`;

    mswServer.use(
      http.get('http://jira.com/rest/api/2/search', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('jql')).toBe(
          "project in ('ppp') AND component in ('ccc') AND resolution = Unresolved AND (status = \"Open\") ORDER BY updated DESC",
        );
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          issues: [
            {
              key: 'project-123',
              self: 'http://jira.com/rest/api/2/issue/ppp-1',
            },
          ],
        });
      }),
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
  });

  it('combines jira.com/jql annotation with filter query and sends correct JQL to Jira (useApiV3)', async () => {
    // Create config with useApiV3 set to true
    const mockConfigV3 = mockServices.rootConfig({
      data: {
        jiraDashboard: {
          baseUrl: 'http://jira.com/rest/api/3/',
          token: 'token',
          headers: {
            'Custom-Header': 'custom value',
          },
          userEmailSuffix: '@backstage.com',
          useApiV3: true,
        },
      },
    });

    const instanceV3 = JiraConfig.fromConfig(mockConfigV3).getInstance();

    // Simulate annotation and filter
    const annotationJql = 'status = "Open"';
    const filterQuery = 'resolution = Unresolved';
    const orderBy = 'ORDER BY updated DESC';
    const combinedJql = `${filterQuery} AND (${annotationJql}) ${orderBy}`;

    mswServer.use(
      http.get('http://jira.com/rest/api/3/search/jql', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('jql')).toBe(
          "project in ('ppp') AND component in ('ccc') AND resolution = Unresolved AND (status = \"Open\") ORDER BY updated DESC",
        );
        expect(url.searchParams.get('fields')).toBe('*all');
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Custom-Header')).toBe('custom value');
        expect(request.headers.get('Authorization')).toBe('token');
        return HttpResponse.json({
          issues: [
            {
              key: 'project-123',
              self: 'http://jira.com/rest/api/3/issue/ppp-1',
            },
          ],
        });
      }),
    );

    const projects = [
      {
        instance: instanceV3,
        fullProjectKey: 'default/ppp',
        projectKey: 'ppp',
      },
    ];

    // Call getIssuesByFilter with the combined JQL
    await getIssuesByFilter(projects, ['ccc'], combinedJql);
  });
});
