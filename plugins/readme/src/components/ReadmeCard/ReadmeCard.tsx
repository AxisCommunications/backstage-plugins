import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { FetchComponent } from '../FetchComponent';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ReadmeDialog } from '../ReadmeDialog/ReadmeDialog';

type ReadmeCardProps = {
  variant?: InfoCardVariants;
};

export const ReadmeCard = ({ variant }: ReadmeCardProps) => {
  const [displayDialog, setDisplayDialog] = useState(false);

  return (
    <>
      <InfoCard
        title="README"
        variant={variant || 'gridItem'}
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
        <div style={{ overflow: 'auto' }}>
          <Box maxHeight={variant !== 'fullHeight' ? 235 : 500}>
            <FetchComponent />
          </Box>
        </div>
      </InfoCard>

      <ReadmeDialog
        open={displayDialog}
        onClose={() => setDisplayDialog(false)}
      />
    </>
  );
};
