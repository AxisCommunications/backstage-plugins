import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

type Props = {
  handleAuthClick: React.MouseEventHandler<HTMLElement>;
};

export const SignInContent = ({ handleAuthClick }: Props) => {
  return (
    <Box position="relative" height="100%" width="100%">
      <Box
        height="100%"
        width="80%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        p={10}
        left={0}
        top={0}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAuthClick}
          size="large"
        >
          Sign in
        </Button>
      </Box>
    </Box>
  );
};
