import { RootConfigService } from '@backstage/backend-plugin-api';
import { FileType } from './types';

const CONFIG_PATH = 'readme.fileNames';

// Cache placeholder for entities where no readme
export const NOT_FOUND_PLACEHOLDER = 'NOT_FOUND';

const DEFAULT_README_TYPES: FileType[] = [
  { name: 'README.md', type: 'text/markdown' },
  { name: 'README.MD', type: 'text/markdown' },
  { name: 'README', type: 'text/plain' },
  { name: 'README.rst', type: 'text/plain' },
  { name: 'README.txt', type: 'text/plain' },
];

export function getReadmeTypes(config: RootConfigService): FileType[] {
  const readmeTypes = config.getOptionalStringArray(CONFIG_PATH);
  if (!readmeTypes) {
    return DEFAULT_README_TYPES;
  }
  return readmeTypes.map(name => {
    const type =
      name.endsWith('.md') || name.endsWith('.MD')
        ? 'text/markdown'
        : 'text/plain';
    return { name, type };
  });
}
