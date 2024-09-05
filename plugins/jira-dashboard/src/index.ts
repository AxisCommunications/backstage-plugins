/**
 * Frontend plugin that fetches and displays Jira issues for an entity
 *
 * @packageDocumentation
 */

export {
  jiraDashboardPlugin,
  EntityJiraDashboardContent,
  JiraUserIssuesViewCard,
  isJiraDashboardAvailable,
} from './plugin';
export { useJiraUserIssues } from './hooks/useJiraUserIssues';
export { useJira } from './hooks/useJira';
export type { JiraUserIssuesCardProps } from './components/JiraUserIssuesCard';
export type { JiraDashboardApi } from './api/JiraDashboardApi';
