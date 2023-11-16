import React, { useState } from 'react';
import { Box, IconButton } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { FetchComponent } from '../FetchComponent';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
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
