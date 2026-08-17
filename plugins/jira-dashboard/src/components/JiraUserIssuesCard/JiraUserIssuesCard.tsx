import { BottomLinkProps, TableOptions } from '@backstage/core-components';
import { ButtonLink, type ButtonLinkProps } from '@backstage/ui';
import { EntityInfoCard } from '@backstage/plugin-catalog-react';

import {
  JiraUserIssuesTable,
  TableComponentProps,
} from '../JiraUserIssuesTable';

import { Issue } from '@axis-backstage/plugin-jira-dashboard-common';

/**
 * Jira user issues list card properties
 * @public */
export type JiraUserIssuesCardProps = {
  title?: string;
  maxResults?: number;
  // XXX: next breaking release — drop this core-components bridge for `footerActions?: ReactNode` (straight EntityInfoCard passthrough), which also removes the onClick cast and the _blank guesswork below
  bottomLinkProps?: BottomLinkProps;
  tableOptions?: TableOptions<Issue>;
  tableStyle?: TableComponentProps['style'];
  filterName?: string;
};

/**
 * Jira user issues list card.
 * @public */
export const JiraUserIssuesCard = ({
  title,
  maxResults,
  bottomLinkProps,
  tableOptions = {
    toolbar: false,
    search: false,
    paging: true,
    pageSize: 10,
  },
  tableStyle = {
    padding: '0px',
    overflowY: 'auto',
    width: '100%',
  },
  filterName,
}: JiraUserIssuesCardProps) => {
  return (
    <EntityInfoCard
      title={title}
      footerActions={
        bottomLinkProps && (
          // XXX: hardcoded _blank breaks internal links — should BUI Link/ButtonLink detect external hrefs itself (as core-components Link does), or is core-components Link meant to be reimplemented on BUI?
          <ButtonLink
            variant="tertiary"
            href={bottomLinkProps.link}
            // cast: react-aria types the event against FocusableElement, BottomLinkProps against HTMLAnchorElement
            onClick={bottomLinkProps.onClick as ButtonLinkProps['onClick']}
            target="_blank"
            rel="noopener noreferrer"
          >
            {bottomLinkProps.title}
          </ButtonLink>
        )
      }
    >
      <JiraUserIssuesTable
        maxResults={maxResults}
        tableOptions={tableOptions}
        tableStyle={tableStyle}
        filterName={filterName}
      />
    </EntityInfoCard>
  );
};
