/**
 * Frontend plugin that allows visualization of component statuses from statuspage.io.
 *
 * @packageDocumentation
 */
export {
  isStatuspageAvailable,
  statuspagePlugin,
  StatuspagePage,
} from './plugin';
export { StatuspageComponent, StatuspageEntityComponent } from './components';
export type { StatuspageProps } from './components';
