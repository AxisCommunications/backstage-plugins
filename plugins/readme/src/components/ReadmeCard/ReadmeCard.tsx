import { FetchComponent } from '../FetchComponent';
import { ReadmeDialog } from '../ReadmeDialog/ReadmeDialog';
import { InfoCard } from '@backstage/core-components';
import { Box, IconButton } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, { useState } from 'react';

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
          >
            <OpenInNewIcon />
          </IconButton>
        }
      >
        <div style={{ overflow: 'auto' }}>
          <Box sx={{ maxHeight: 235 }}>
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
