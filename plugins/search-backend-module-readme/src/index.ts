/**
 * A search backend module that indexes the README files of catalog entities.
 *
 * @packageDocumentation
 */

export { searchModuleReadmeCollator as default } from './module';
export { DefaultReadmeCollatorFactory } from './collator/DefaultReadmeCollatorFactory';
export type { ReadmeDocument } from './collator/DefaultReadmeCollatorFactory';
export type { ReadmeCollatorFactoryOptions } from './collator/config';
