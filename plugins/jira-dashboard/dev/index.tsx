import { ReactNode } from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { EntityJiraDashboardContent, jiraDashboardPlugin } from '../src';
import { JiraDashboardApi, jiraDashboardApiRef } from '../src/api';
import { JiraDashboardContent } from '../src/components/JiraDashboardContent';
import { JiraProjectCard } from '../src/components/JiraProjectCard';
import { JiraTable } from '../src/components/JiraTable';
import { JiraUserIssuesCard } from '../src/components/JiraUserIssuesCard';
import { JiraUserIssuesTable } from '../src/components/JiraUserIssuesTable';
import { Content, Page } from '@backstage/core-components';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { Flex, Text } from '@backstage/ui';
import {
  Issue,
  JiraDataResponse,
  JiraResponse,
  Project,
} from '@axis-backstage/plugin-jira-dashboard-common';
import multiProjectResponse from './__fixtures__/jiraResponse.json';
import singleProjectResponse from './__fixtures__/singleProjectResponse.json';
import cloudResponse from './__fixtures__/jiraCloudResponse.json';
import multiProjectEntity from './__fixtures__/entity.json';

// One entity per dashboard variant. The mock API returns a different fixture
// per entity ref, so all three dashboards can coexist in the same dev app.
const singleProjectEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'single-project-service',
    description: 'Entity backed by a single Jira Server project',
    annotations: { 'jira.com/project-key': 'BS' },
  },
  spec: { lifecycle: 'production', type: 'service', owner: 'user:guest' },
};

const cloudProjectEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'jenkins-meeting-actions',
    description: 'Entity backed by a Jira Cloud project',
    annotations: { 'jira.com/project-key': 'MEETING' },
  },
  spec: { lifecycle: 'production', type: 'service', owner: 'user:guest' },
};

// Fixtures are intentionally partial vs the full Jira schema, hence the casts.
const responsesByEntityRef: Record<string, JiraResponse> = {
  [stringifyEntityRef(multiProjectEntity as Entity)]:
    multiProjectResponse as unknown as JiraResponse,
  [stringifyEntityRef(singleProjectEntity)]:
    singleProjectResponse as unknown as JiraResponse,
  [stringifyEntityRef(cloudProjectEntity)]:
    cloudResponse as unknown as JiraResponse,
};

const userIssues = (singleProjectResponse.data[0].issues ??
  []) as unknown as Issue[];

const mockJiraDashboardApi: JiraDashboardApi = {
  getJiraResponseByEntity: async entityRef =>
    responsesByEntityRef[entityRef] ??
    (multiProjectResponse as unknown as JiraResponse),
  getLoggedInUserIssues: async () => userIssues,
  getProjectAvatar: async () => undefined,
};

// Standalone fixtures for the component-in-isolation pages.
const sampleProject = singleProjectResponse.project as Project;
const sampleDataGroup = singleProjectResponse
  .data[0] as unknown as JiraDataResponse;
const emptyDataGroup: JiraDataResponse = {
  name: 'No open issues',
  type: 'filter',
  query: 'resolution = Unresolved ORDER BY updated DESC',
  issues: [],
};
const minimalProject: Project = {
  name: 'Minimal Project',
  key: 'MIN',
  description: '',
  avatarUrls: {
    '48x48': 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Min',
  },
  projectTypeKey: '',
  lead: { key: '', displayName: '' },
  self: 'https://jira.com/project/999',
};

function DevPage(props: { children: ReactNode }) {
  return (
    <Page themeId="home">
      <Content>{props.children}</Content>
    </Page>
  );
}

function Section(props: { title: string; children: ReactNode }) {
  return (
    <Flex direction="column" gap="4" mb="6">
      <Text variant="title-small">{props.title}</Text>
      {props.children}
    </Flex>
  );
}

createDevApp()
  .registerPlugin(jiraDashboardPlugin)
  .registerApi({
    api: jiraDashboardApiRef,
    deps: {},
    factory: () => mockJiraDashboardApi,
  })
  .addPage({
    title: 'Dashboard: Multi-project',
    path: '/jira-dashboard',
    element: (
      <DevPage>
        <EntityProvider entity={multiProjectEntity as Entity}>
          <EntityJiraDashboardContent />
        </EntityProvider>
      </DevPage>
    ),
  })
  .addPage({
    title: 'Dashboard: Single project',
    path: '/jira-dashboard-single',
    element: (
      <DevPage>
        <EntityProvider entity={singleProjectEntity}>
          <JiraDashboardContent />
        </EntityProvider>
      </DevPage>
    ),
  })
  .addPage({
    title: 'Dashboard: Jira Cloud',
    path: '/jira-dashboard-cloud',
    element: (
      <DevPage>
        <EntityProvider entity={cloudProjectEntity}>
          <JiraDashboardContent />
        </EntityProvider>
      </DevPage>
    ),
  })
  .addPage({
    title: 'JiraTable states',
    path: '/jira-table',
    element: (
      <DevPage>
        <Section title="With filters (showFilters)">
          <JiraTable
            tableContent={sampleDataGroup}
            project={sampleProject}
            showFilters
          />
        </Section>
        <Section title="Without filters">
          <JiraTable tableContent={sampleDataGroup} project={sampleProject} />
        </Section>
        <Section title="Empty (no issues)">
          <JiraTable
            tableContent={emptyDataGroup}
            project={sampleProject}
            showFilters
          />
        </Section>
      </DevPage>
    ),
  })
  .addPage({
    title: 'JiraProjectCard',
    path: '/jira-project-card',
    element: (
      <DevPage>
        <Section title="Full project (category, description, lead)">
          <JiraProjectCard project={sampleProject} />
        </Section>
        <Section title="Minimal project (no category/description/lead)">
          <JiraProjectCard project={minimalProject} />
        </Section>
      </DevPage>
    ),
  })
  .addPage({
    title: 'JiraUserIssuesCard',
    path: '/jira-user-issues',
    element: (
      <DevPage>
        <Section title="Card with deep-link footer (bottomLinkProps)">
          <JiraUserIssuesCard
            title="My open issues"
            bottomLinkProps={{
              title: 'View all my issues in Jira',
              link: 'https://jira.com/issues/?jql=assignee=currentUser()',
            }}
          />
        </Section>
        <Section title="Card without footer">
          <JiraUserIssuesCard title="My open issues" />
        </Section>
        <Section title="Table only (JiraUserIssuesTable)">
          <JiraUserIssuesTable />
        </Section>
      </DevPage>
    ),
  })
  .render();
