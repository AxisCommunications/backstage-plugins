import { Avatar, ButtonLink, Flex } from '@backstage/ui';
import { EntityInfoCard } from '@backstage/plugin-catalog-react';
import { Project } from '@axis-backstage/plugin-jira-dashboard-common';
import { ProjectInfoLabel } from './ProjectInfoLabel';
import { getProjectUrl } from '../../lib';

type JiraProjectCardProps = {
  project: Project;
};

const CardTitle = (props: { title: string; pictureSrc?: string }) => (
  <Flex align="center" gap="2">
    <Avatar
      size="large"
      purpose="decoration"
      name={props.title}
      src={props.pictureSrc || ''}
    />
    {props.title}
  </Flex>
);

export const JiraProjectCard = ({ project }: JiraProjectCardProps) => {
  const title = project.projectTypeKey
    ? `${project.name} | ${project.projectTypeKey}`
    : project.name;

  return (
    <EntityInfoCard
      title={
        <CardTitle title={title} pictureSrc={project.avatarUrls['48x48']} />
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
