import Divider from '@mui/material/Divider';
import { Flex, Text } from '@backstage/ui';
import {
  Avatar,
  InfoCard,
  MarkdownContent,
  LinkButton,
} from '@backstage/core-components';
import { Project } from '@axis-backstage/plugin-jira-dashboard-common';
import { ProjectInfoLabel } from './ProjectInfoLabel';
import { getProjectUrl } from '../../lib';
import styles from './JiraProjectCard.module.css';

type JiraProjectCardProps = {
  project: Project;
};

export const JiraProjectCard = ({ project }: JiraProjectCardProps) => {
  return (
    <InfoCard variant="fullHeight">
      <Flex direction="row" gap="2" align="center" mb="2">
        <Avatar
          picture={project.avatarUrls['48x48']}
          customStyles={{
            width: 50,
            height: 50,
          }}
        />

        <Text variant="title-x-small">
          {project.name} | {project.projectTypeKey ?? ''}
        </Text>
      </Flex>
      <Divider />
      <Flex direction="column" gap="4" ml="2" my="4">
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
      <LinkButton
        color="primary"
        variant="contained"
        to={getProjectUrl(project)}
      >
        Go to project
      </LinkButton>
    </InfoCard>
  );
};
