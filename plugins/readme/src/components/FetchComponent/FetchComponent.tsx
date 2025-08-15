import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import {
  CodeSnippet,
  ErrorPanel,
  Link,
  MarkdownContent,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { readmeApiRef } from '../../api/ReadmeApi';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { getEntitySourceLocation } from '@backstage/catalog-model';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ResponseError } from '@backstage/errors';

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
    async (): Promise<string[]> =>
      await readmeApi.getReadmeContent(stringifyEntityRef(entity)),
    [entity],
  );

  if (loading) {
    return <Progress />;
  }

  if (error instanceof ResponseError) {
    if (error.statusCode === 404) {
      return (
        <Box>
          <Typography pb={2} variant="body2">
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
    return <ResponseErrorPanel error={error} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }
  if (!content) {
    return <ErrorPanel error={Error('Unknown error')} />;
  }
  if (!content[1] || content[1] === 'error') {
    return <ErrorPanel error={Error(content[1] ?? 'Unknown error')} />;
  } else if (content[1].startsWith('text/markdown')) {
    return <MarkdownContent content={content[0]} />;
  }
  // probably text/plain
  return (
    <div data-testid="readme-content">
      <CodeSnippet text={content[0]} language="plaintext" />
    </div>
  );
};
