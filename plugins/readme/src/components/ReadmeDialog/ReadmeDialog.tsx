import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import { FetchComponent } from '../FetchComponent';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ReadmeDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h4">README</Typography>
      </DialogTitle>
      <DialogContent>
        <FetchComponent />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};