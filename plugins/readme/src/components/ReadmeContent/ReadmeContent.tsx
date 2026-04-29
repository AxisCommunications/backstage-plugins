import {
  CodeSnippet,
  ErrorPanel,
  MarkdownContent,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ResponseError } from '@backstage/errors';
import type { UseReadmeContentResult } from '../../hooks/useReadmeContent';

export type ReadmeContentProps = UseReadmeContentResult;

export const ReadmeContent = ({
  content,
  loading,
  error,
  location,
}: ReadmeContentProps) => {
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
  }
  if (content[1].startsWith('text/markdown')) {
    return <MarkdownContent content={content[0]} />;
  }
  // probably text/plain
  return (
    <div data-testid="readme-content">
      <CodeSnippet text={content[0]} language="plaintext" />
    </div>
  );
};
