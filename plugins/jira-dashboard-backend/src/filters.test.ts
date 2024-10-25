import { getDefaultFiltersForUser } from './filters';
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
});
