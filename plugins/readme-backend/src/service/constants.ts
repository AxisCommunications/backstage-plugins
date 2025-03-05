import { FileType } from './types';
import { Config } from '@backstage/config';

// Cache placeholder for entities where no readme
export const NOT_FOUND_PLACEHOLDER = 'NOT_FOUND';
export const DEFAULT_TTL = 1800 * 1000;

const DEFAULT_README_TYPES: FileType[] = [
  { name: 'README.md', type: 'text/markdown' },
  { name: 'README.MD', type: 'text/markdown' },
  { name: 'README', type: 'text/plain' },
  { name: 'README.rst', type: 'text/plain' },
  { name: 'README.txt', type: 'text/plain' },
];

export function getReadmeTypes(config: Config): FileType[] {
  const readmeTypes = config.getOptionalStringArray('readme.types');
  if (!readmeTypes) {
    return DEFAULT_README_TYPES;
  }
  return readmeTypes.map(name => {
    const type = name.endsWith('.md') || name.endsWith('.MD') ? 'text/markdown' : 'text/plain';
    return { name, type };
  });
}
