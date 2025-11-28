import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { JiraConfig } from '../config';
import { getIssueByKey } from '../api';

export const createGetJiraTicketInfoAction = ({
  actionsRegistry,
  rootConfig,
  logger,
}: {
  actionsRegistry: ActionsRegistryService;
  rootConfig: RootConfigService;
  logger: LoggerService;
}) => {
  actionsRegistry.register({
    name: 'get-jira-ticket-info',
    title: 'Get Jira Ticket Information',
    description:
      'Retrieves summary and description for a Jira ticket by its key. Use this when users ask about a specific issue or need ticket details.',
    schema: {
      input: z =>
        z.object({
          issueKey: z
            .string()
            .describe(
              'Jira issue key in format PROJECT-NUMBER (e.g., "PROJ-123", "ABC-456")',
            ),
          instance: z
            .string()
            .optional()
            .describe(
              'Jira instance name when multiple instances are configured. Omit to use the default instance.',
            ),
        }),
      output: z =>
        z.object({
          key: z.string().describe('The Jira issue key'),
          summary: z
            .string()
            .optional()
            .describe('Brief one-line summary of the issue'),
          description: z
            .string()
            .optional()
            .describe(
              'Detailed description of the issue. May be empty if no description was provided.',
            ),
        }),
    },
    action: async ({ input }) => {
      const config = JiraConfig.fromConfig(rootConfig);
      const instance = config.getInstance(input.instance);

      try {
        const issue = await getIssueByKey(input.issueKey, instance);

        return {
          output: {
            key: issue.key,
            summary: issue.fields?.summary,
            description: issue.fields?.description,
          },
        };
      } catch (error) {
        logger.error(`Failed to fetch Jira ticket ${input.issueKey}: ${error}`);
        throw error;
      }
    },
  });
};
