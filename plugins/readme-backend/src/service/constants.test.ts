import { mockServices } from '@backstage/backend-test-utils';
import { NOT_FOUND_PLACEHOLDER, getReadmeTypes } from './constants';

describe('constants', () => {
  describe('NOT_FOUND_PLACEHOLDER', () => {
    it('should be defined', () => {
      expect(NOT_FOUND_PLACEHOLDER).toBeDefined();
      expect(NOT_FOUND_PLACEHOLDER).toBe('NOT_FOUND');
    });
  });

  describe('getReadmeTypes', () => {
    it('should return default readme types when config is empty', () => {
      const config = mockServices.rootConfig({
        data: {},
      });
      const readmeTypes = getReadmeTypes(config);
      expect(readmeTypes).toEqual([
        { name: 'README.md', type: 'text/markdown' },
        { name: 'README.MD', type: 'text/markdown' },
        { name: 'README', type: 'text/plain' },
        { name: 'README.rst', type: 'text/plain' },
        { name: 'README.txt', type: 'text/plain' },
      ]);
    });

    it('should return custom readme types from config', () => {
      const config = mockServices.rootConfig({
        data: {
          readme: {
            fileNames: ['CUSTOM.md', 'CUSTOM.txt'],
          },
        },
      });
      const readmeTypes = getReadmeTypes(config);
      expect(readmeTypes).toEqual([
        { name: 'CUSTOM.md', type: 'text/markdown' },
        { name: 'CUSTOM.txt', type: 'text/plain' },
      ]);
    });
  });
});
