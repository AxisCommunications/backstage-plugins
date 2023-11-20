import React from 'react';
import { Card, Box, Divider, Typography } from '@material-ui/core';
import { Avatar } from '@backstage/core-components';
import { LinkButton } from '@backstage/core-components';
import { Project } from '@axis-backstage/plugin-jira-dashboard-common';
import { ProjectInfoLabel } from './ProjectInfoLabel';
import { getProjectUrl } from '../../lib';

type JiraProjectCardProps = {
  project: Project;
};

export const JiraProjectCard = ({ project }: JiraProjectCardProps) => {
  return (
    <Card style={{ padding: 20, height: '100%' }}>
      <Box display="inline-flex" alignItems="center" mb={2}>
        <Avatar
          picture={project.avatarUrls['48x48']}
          customStyles={{
            width: 50,
            height: 50,
          }}
        />

        <Typography style={{ fontSize: 20, marginLeft: 3 }}>
          {project.name} | {project.projectTypeKey ?? ''}
        </Typography>
      </Box>
      <Box ml={1}>
        <Divider style={{ marginBottom: 10 }} />
        <ProjectInfoLabel label="Project key" value={project.key} />
        {project.projectCategory.name && (
          <ProjectInfoLabel
            label="Category"
            value={project.projectCategory.name}
          />
        )}
        {project.description && (
          <ProjectInfoLabel label="Description" value={project.description} />
        )}
        {project.lead.key && (
          <ProjectInfoLabel label="Project lead" value={project.lead.key} />
        )}

        <LinkButton
          color="primary"
          variant="contained"
          to={getProjectUrl(project)}
          style={{ marginTop: 35 }}
        >
          Go to project
        </LinkButton>
      </Box>
    </Card>
  );
};
