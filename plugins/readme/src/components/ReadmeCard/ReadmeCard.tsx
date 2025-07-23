import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { FetchComponent } from '../FetchComponent';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { ReadmeDialog } from '../ReadmeDialog/ReadmeDialog';

/**
 * ReadmeCardProps props.
 *
 * @public
 */

export type ReadmeCardProps = {
  variant?: InfoCardVariants;
  maxHeight?: string | number;
};

export const ReadmeCard = (props: ReadmeCardProps) => {
  const { variant = 'gridItem', maxHeight: propMaxHeight } = props;
  const maxHeight =
    variant === 'fullHeight' ? 'none' : propMaxHeight ?? '235px';

  const [displayDialog, setDisplayDialog] = useState(false);

  return (
    <>
      <InfoCard
        title="README"
        variant={variant}
        action={
          variant !== 'fullHeight' ? (
            <IconButton
              onClick={() => setDisplayDialog(true)}
              aria-label="Open full view"
              role="button"
              title="Open full view"
              size="large"
            >
              <FullscreenIcon />
            </IconButton>
          ) : undefined
        }
      >
        <div style={{ overflow: 'auto' }}>
          <Box maxHeight={maxHeight}>
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
