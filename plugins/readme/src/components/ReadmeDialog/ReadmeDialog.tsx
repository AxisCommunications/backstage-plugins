import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { FetchComponent } from '../FetchComponent';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ReadmeDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      data-testid="content-dialog"
    >
      <DialogTitle>README</DialogTitle>
      <DialogContent dividers>
        <Box minWidth={650}>
          <FetchComponent />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          aria-label="close"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
