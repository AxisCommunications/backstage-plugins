import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Avatar, InfoCard } from '@backstage/core-components';
import { LinkButton } from '@backstage/core-components';
import { Project } from '@axis-backstage/plugin-jira-dashboard-common';
import { ProjectInfoLabel } from './ProjectInfoLabel';
import { getProjectUrl } from '../../lib';

type JiraProjectCardProps = {
  project: Project;
};

export const JiraProjectCard = ({ project }: JiraProjectCardProps) => {
  return (
    <InfoCard variant="fullHeight">
      <Stack direction="row" gap={1} alignItems="center" mb={1}>
        <Avatar
          picture={project.avatarUrls['48x48']}
          customStyles={{
            width: 50,
            height: 50,
          }}
        />

        <Typography fontSize={20}>
          {project.name} | {project.projectTypeKey ?? ''}
        </Typography>
      </Stack>
      <Divider />
      <Stack gap={2} ml={1} my={2}>
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
      </Stack>
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
