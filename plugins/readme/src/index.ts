/**
 * Frontend plugin that fetches and displays the readme for an entity
 *
 * @packageDocumentation
 */

export { readmePlugin, ReadmeCard } from './plugin';
export type { ReadmeCardProps } from './components/ReadmeCard';
export { isReadmeAvailable } from './api/ReadmeClient';
export { ReadmeSearchResultListItem } from './components/ReadmeSearchResultListItem';
export type { ReadmeSearchResultListItemProps } from './components/ReadmeSearchResultListItem';
