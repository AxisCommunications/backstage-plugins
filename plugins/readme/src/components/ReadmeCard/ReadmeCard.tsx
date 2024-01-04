import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { InfoCard } from '@backstage/core-components';
import { FetchComponent } from '../FetchComponent';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ReadmeDialog } from '../ReadmeDialog/ReadmeDialog';

export const ReadmeCard = () => {
  const [displayDialog, setDisplayDialog] = useState(false);

  return (
    <>
      <InfoCard
        title="README"
        variant="flex"
        action={
          <IconButton
            onClick={() => setDisplayDialog(true)}
            aria-label="open dialog"
            role="button"
            title="Open in dialog"
            size="large"
          >
            <OpenInNewIcon />
          </IconButton>
        }
      >
        <div style={{ overflow: 'auto' }}>
          <Box maxHeight={235}>
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
