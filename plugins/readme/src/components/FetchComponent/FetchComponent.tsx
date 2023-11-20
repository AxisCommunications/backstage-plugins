import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import {
  CodeSnippet,
  Link,
  MarkdownContent,
  Progress,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { readmeApiRef } from '../../api/ReadmeApi';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Alert } from '@material-ui/lab';
import { getEntitySourceLocation } from '@backstage/catalog-model';
import { Box, Typography } from '@material-ui/core';

export const FetchComponent = () => {
  const { entity } = useEntity();
  const readmeApi = useApi(readmeApiRef);
  let location;

  try {
    const { target } = getEntitySourceLocation(entity);
    location = target ?? target;
  } catch (err) {
    location = ': Unknown';
  }

  const {
    value: content,
    loading,
    error,
  } = useAsync(
    async (): Promise<any> =>
      await readmeApi.getReadmeContent(stringifyEntityRef(entity)),
    [entity],
  );

  if (loading) {
    return <Progress />;
  }
  if (error?.message === '404') {
    return (
      <Box>
        <Typography variant="body2" style={{ paddingBottom: 15 }}>
          No README.md file found at source location:{' '}
          {location && <strong>{location}</strong>}
        </Typography>
        <Typography variant="body2">
          Need help? Go to our{' '}
          <Link to="https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/readme/README.md">
            documentation
          </Link>
        </Typography>
      </Box>
    );
  }
  if (error as unknown) {
    return (
      // @ts-ignore
      <Alert severity="error">{error.message ? error.message : error}</Alert>
    );
  }
  if (!content) {
    return <Alert severity="error">Error</Alert>;
  }
  if (content[1] === 'error') {
    return <Alert severity="info">{content[0]}</Alert>;
  } else if (content[1].startsWith('text/markdown')) {
    return <MarkdownContent content={content[0]} />;
  }
  // probably text/plain
  return <CodeSnippet text={content[0]} language="plaintext" />;
};
