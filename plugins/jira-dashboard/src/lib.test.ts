import { getJiraBaseUrl, getProjectUrl, getIssueUrl } from './lib';

const mockedProject = {
  name: 'Backstage',
  key: 'BS',
  description: 'This is our Backstage project',
  avatarUrls: {
    '48x48': 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Duane',
  },
  projectTypeKey: 'Software',
  projectCategory: {
    name: 'Software Portals',
  },
  lead: {
    key: 'fridaja',
    displayName: 'Frida Jacobsson',
  },
  self: 'https://jira.com/rest/api/2/project/123',
};

describe('getJiraBaseUrl', () => {
  it('should return the base URL of a Jira instance', () => {
    const baseUrl = 'https://jira.com/rest/api/2/project/123';
    const expected = 'https://jira.com';
    expect(getJiraBaseUrl(baseUrl)).toEqual(expected);
  });

  it('should handle URLs with additional paths', () => {
    const baseUrl = 'https://jira.com/my-path/rest/api/2/project/123';
    const expected = 'https://jira.com/my-path';
    expect(getJiraBaseUrl(baseUrl)).toEqual(expected);
  });
});

describe('getProjectUrl', () => {
  it('should return the URL to a Jira project', () => {
    const expected = 'https://jira.com/browse/BS';
    expect(getProjectUrl(mockedProject)).toEqual(expected);
  });
  it('should handle URLs with additional paths', () => {
    const expected = 'https://jira.com/my-path/browse/BS';
    mockedProject.self = 'https://jira.com/my-path/rest/api/2/project/123';
    expect(getProjectUrl(mockedProject)).toEqual(expected);
  });
});

describe('getIssueUrl', () => {
  it('should return the URL to an issue', () => {
    const issueUrl = 'https://jira.com/rest/api/2/issue/123';
    const issueKey = 'PROJ-123';
    const expected = 'https://jira.com/browse/PROJ-123';
    expect(getIssueUrl(issueUrl, issueKey)).toEqual(expected);
  });
  it('should handle URLs with additional paths', () => {
    const issueUrl = 'https://jira.com/my-path/rest/api/2/issue/123';
    const issueKey = 'PROJ-123';
    const expected = 'https://jira.com/my-path/browse/PROJ-123';
    expect(getIssueUrl(issueUrl, issueKey)).toEqual(expected);
  });
});
