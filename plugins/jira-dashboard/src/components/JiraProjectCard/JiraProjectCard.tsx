import { Avatar, ButtonLink, Flex, Text } from '@backstage/ui';
import { MarkdownContent } from '@backstage/core-components';
import { EntityInfoCard } from '@backstage/plugin-catalog-react';
import { Project } from '@axis-backstage/plugin-jira-dashboard-common';
import { ProjectInfoLabel } from './ProjectInfoLabel';
import { getProjectUrl } from '../../lib';
import styles from './JiraProjectCard.module.css';

type JiraProjectCardProps = {
  project: Project;
};

export const JiraProjectCard = ({ project }: JiraProjectCardProps) => {
  return (
    <EntityInfoCard
      title={
        <Flex align="center" gap="2">
          <Avatar
            size="small"
            purpose="decoration"
            name={project.name}
            src={project.avatarUrls['48x48'] || ''}
          />
          <Text as="span">
            {project.projectTypeKey
              ? `${project.name} | ${project.projectTypeKey}`
              : project.name}
          </Text>
        </Flex>
      }
    >
      <Flex direction="column" gap="4" mb="4">
        <ProjectInfoLabel label="Project key" value={project.key} />
        {project.projectCategory?.name && (
          <ProjectInfoLabel
            label="Category"
            value={project.projectCategory.name}
          />
        )}
        {project.description && (
          <ProjectInfoLabel label="Description" value={project.description} />
        )}
        {(project?.lead?.key || project?.lead?.displayName) && (
          <ProjectInfoLabel
            label="Project lead"
            value={project?.lead?.displayName || project?.lead?.key}
          />
        )}
      </Flex>
      <ButtonLink
        variant="primary"
        href={getProjectUrl(project)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Go to project
      </ButtonLink>
    </EntityInfoCard>
  );
};
