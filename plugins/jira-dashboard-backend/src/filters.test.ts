import { getAssigneUser, getDefaultFiltersForUser } from './filters';
import { mockServices } from '@backstage/backend-test-utils';
import { UserEntity } from '@backstage/catalog-model';
import { ConfigInstance, JiraConfig } from './config';

describe('getDefaultFiltersForUser', () => {
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
  const mockInstance: ConfigInstance = {
    token: 'mock_token',
    headers: {},
    baseUrl: 'http://jira.com',
    defaultFilters: [
      {
        name: 'My Open Bugs',
        shortName: 'MyBugs',
        query: 'type = Bug AND resolution = Unresolved',
      },
    ],
  };

  const mockUserEntity: UserEntity = {
    apiVersion: 'backstage.io/v1beta1',
    kind: 'User',
    metadata: {
      namespace: 'default',
      name: 'fridaja',
      description: 'Software Developer',
    },

    spec: {
      profile: {
        displayName: 'Frida Jacobsson',
        email: 'Frida.Jacobsson@axis.com',
      },
    },
  };

  it('returns userEmailSuffix email when config is provided', () => {
    const filters = getDefaultFiltersForUser(instance, mockUserEntity);
    expect(filters).toHaveLength(3);
    expect(filters).toContainEqual(
      expect.objectContaining({
        shortName: 'ME',
        query: expect.stringContaining('fridaja@backstage.com'),
      }),
    );
  });

  it('returns backstage email when userEmailSuffix config is not provided', () => {
    const filters = getDefaultFiltersForUser(
      {} as ConfigInstance,
      mockUserEntity,
    );
    expect(filters).toHaveLength(3);
    expect(filters).toContainEqual(
      expect.objectContaining({
        shortName: 'ME',
        query: expect.stringContaining('Frida.Jacobsson@axis.com'),
      }),
    );
  });

  it('do not return Assigned to me filter when userEntity is not provided', () => {
    const filters = getDefaultFiltersForUser(instance);
    expect(filters).toHaveLength(2);
  });

  it('should include defaultFilters from config', () => {
    const filters = getDefaultFiltersForUser(mockInstance, mockUserEntity);
    expect(filters).toContainEqual(
      expect.objectContaining({
        name: 'My Open Bugs',
        shortName: 'MyBugs',
        query: 'type = Bug AND resolution = Unresolved',
      }),
    );
  });

  it('should handle empty defaultFilters in config', () => {
    const filters = getDefaultFiltersForUser(mockInstance, mockUserEntity);
    expect(filters).toHaveLength(4);
  });

  it('should correctly apply filterOnUser logic', () => {
    const filters = getDefaultFiltersForUser(mockInstance, mockUserEntity);
    const expectedAssignee = getAssigneUser(mockInstance, mockUserEntity);
    expect(filters).toEqual([
      expect.objectContaining({
        name: 'Open Issues',
        query: 'resolution = Unresolved ORDER BY updated DESC',
        shortName: 'OPEN',
      }),
      expect.objectContaining({
        name: 'Incoming Issues',
        query: "status = 'New' ORDER BY created ASC",
        shortName: 'INCOMING',
      }),
      expect.objectContaining({
        name: 'Assigned to me',
        query: `assignee = "${expectedAssignee}" AND resolution = Unresolved ORDER BY updated DESC`,
        shortName: 'ME',
      }),
      expect.objectContaining({
        name: 'My Open Bugs',
        query: `type = Bug AND resolution = Unresolved`,
        shortName: 'MyBugs',
      }),
    ]);
  });
});
