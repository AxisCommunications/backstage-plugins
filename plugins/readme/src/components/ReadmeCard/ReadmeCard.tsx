import React, { useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { readmeApiRef } from '../../api/ReadmeApi';
import {
  getEntitySourceLocation,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { ReadmeDialog } from '../ReadmeDialog/ReadmeDialog';
import {
  CodeSnippet,
  ErrorPanel,
  InfoCard,
  InfoCardVariants,
  Link,
  MarkdownContent,
  Progress,
} from '@backstage/core-components';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Typography from '@mui/material/Typography';

/**
 * ReadmeCardProps props.
 *
 * @public
 */

export type ReadmeCardProps = {
  variant?: InfoCardVariants;
  hideIfEmpty?: boolean;
};

export const ReadmeCard = ({
  variant = 'gridItem',
  hideIfEmpty = false,
}: ReadmeCardProps) => {
  const { entity } = useEntity();
  const readmeApi = useApi(readmeApiRef);
  let location;

  const maxHeight = variant === 'fullHeight' ? 'none' : '235px';

  const [displayDialog, setDisplayDialog] = useState(false);

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

  if (error?.message === '404' && hideIfEmpty) return null;

  const renderContent = () => {
    if (error?.message === '404') {
      return (
        <>
          <Typography pb={2} variant="body2">
            No README.md file found at source location:
            <strong>{location}</strong>
          </Typography>
          <Typography variant="body2">
            Need help? Go to our{' '}
            <Link to="https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/readme/README.md">
              documentation
            </Link>
          </Typography>
        </>
      );
    }

    if (error) return <ErrorPanel error={error} />;

    if (!content) return <ErrorPanel error={Error('Unknown error')} />;

    if (content[1]?.startsWith('text/markdown')) {
      return <MarkdownContent content={content[0]} />;
    }
    return (
      <div data-testid="readme-content">
        <CodeSnippet text={content[0]} language="plaintext" />
      </div>
    );
  };

  return (
    <>
      <InfoCard
        title="README"
        variant={variant}
        action={
          variant !== 'fullHeight' ? (
            <IconButton
              onClick={() => setDisplayDialog(true)}
              aria-label="open dialog"
              role="button"
              title="Open in dialog"
              size="large"
            >
              <OpenInNewIcon />
            </IconButton>
          ) : undefined
        }
      >
        <Box overflow="auto" maxHeight={maxHeight}>
          {renderContent()}
        </Box>
      </InfoCard>
      <ReadmeDialog
        open={displayDialog}
        onClose={() => setDisplayDialog(false)}
      />
    </>
  );
};
