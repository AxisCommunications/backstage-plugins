/**
 * A backend module for the readme plugin that registers an action with the
 * Actions Registry, making README content available to AI systems through
 * the MCP actions backend plugin.
 *
 * @packageDocumentation
 */

export { default } from './module';
export { readmeMcpActionsModule } from './module';
export { createGetReadmeContentAction } from './actions/getReadmeContentAction';
export type { GetReadmeContentActionOptions } from './actions/getReadmeContentAction';
