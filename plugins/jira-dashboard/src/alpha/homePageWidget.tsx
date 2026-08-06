import { HomePageWidgetBlueprint } from '@backstage/plugin-home-react/alpha';
import { z } from 'zod';

/**
 * Homepage widget that displays Jira issues assigned to the signed-in user.
 *
 * @alpha
 */
export const jiraUserIssuesWidget = HomePageWidgetBlueprint.makeWithOverrides({
  name: 'user-issues',
  configSchema: {
    title: z.string().default('My Jira Issues'),
    maxResults: z.number().int().positive().default(15),
    filterName: z.string().default('default'),
    bottomLink: z
      .object({
        link: z.string(),
        title: z.string().default('Open in Jira'),
      })
      .optional(),
    tableOptions: z
      .object({
        toolbar: z.boolean().default(false),
        search: z.boolean().default(false),
        paging: z.boolean().default(true),
        pageSize: z.number().int().positive().default(10),
      })
      .default({
        toolbar: false,
        search: false,
        paging: true,
        pageSize: 10,
      }),
    tableStyle: z
      .object({
        padding: z.string().default('0px'),
        overflowY: z
          .enum(['auto', 'hidden', 'scroll', 'visible'])
          .default('auto'),
        width: z.string().default('100%'),
      })
      .default({
        padding: '0px',
        overflowY: 'auto',
        width: '100%',
      }),
  },
  factory(originalFactory, { config }) {
    const bottomLink = config.bottomLink;

    return originalFactory({
      name: 'JiraUserIssuesViewCard',
      title: config.title,
      description: 'Shows Jira issues assigned to the signed-in user',
      components: async () => {
        const [{ JiraUserIssuesTable }, { BottomLink }] = await Promise.all([
          import('../components/JiraUserIssuesTable'),
          import('@backstage/core-components'),
        ]);

        return {
          Content: props => <JiraUserIssuesTable {...props} />,
          ...(bottomLink
            ? {
                Actions: () => <BottomLink {...bottomLink} />,
              }
            : {}),
        };
      },
      componentProps: {
        title: '',
        maxResults: config.maxResults,
        filterName: config.filterName,
        tableOptions: config.tableOptions,
        tableStyle: config.tableStyle,
      },
      layout: {
        width: { minColumns: 4, defaultColumns: 8 },
        height: { minRows: 4 },
      },
    });
  },
});
