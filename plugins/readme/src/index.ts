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
