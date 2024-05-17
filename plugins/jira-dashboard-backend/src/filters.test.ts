import { getDefaultFiltersForUser } from './filters';
import { ConfigReader } from '@backstage/config';
import { UserEntity } from '@backstage/catalog-model';

describe('getDefaultFiltersForUser', () => {
  const mockConfig = new ConfigReader({
    jiraDashboard: {
      userEmailSuffix: '@backstage.com',
    },
  });

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
    const filters = getDefaultFiltersForUser(mockConfig, mockUserEntity);
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
      new ConfigReader({}),
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
    const filters = getDefaultFiltersForUser(mockConfig);
    expect(filters).toHaveLength(2);
  });
});
