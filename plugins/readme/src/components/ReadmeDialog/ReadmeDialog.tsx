import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ReadmeCard } from '../ReadmeCard';

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
      <ReadmeCard />
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
