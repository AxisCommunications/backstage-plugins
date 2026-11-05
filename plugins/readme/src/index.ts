/**
 * Frontend plugin that fetches and displays the readme for an entity
 *
 * @packageDocumentation
 */

export { readmePlugin, ReadmeCard } from './plugin';
export type {
  ReadmeCardProps,
  ReadmeCardLegacyProps,
} from './components/ReadmeCard';
export { isReadmeAvailable } from './api/ReadmeClient';
export { ReadmeEntityContent } from './components/ReadmeEntityContent';
export type { ReadmeEntityContentProps } from './components/ReadmeEntityContent';
export { ReadmeSearchResultListItem } from './components/ReadmeSearchResultListItem';
export type {
  ReadmeSearchResult,
  ReadmeSearchResultListItemProps,
} from './components/ReadmeSearchResultListItem';
