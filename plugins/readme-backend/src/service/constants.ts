import { FileType } from './types';

// Cache placeholder for entities where no readme
export const NOT_FOUND_PLACEHOLDER = 'NOT_FOUND';

export const README_TYPES: FileType[] = [
  { name: 'README.md', type: 'text/markdown' },
  { name: 'README.MD', type: 'text/markdown' },
  { name: 'README', type: 'text/plain' },
  { name: 'README.rst', type: 'text/plain' },
  { name: 'README.txt', type: 'text/plain' },
];
