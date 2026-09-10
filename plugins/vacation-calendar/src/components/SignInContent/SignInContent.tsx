import { Box, Button } from '@backstage/ui';

type Props = {
  handleAuthClick: () => void;
};

export const SignInContent = ({ handleAuthClick }: Props) => {
  return (
    <Box position="relative" height="100%" width="100%">
      <Box
        height="100%"
        width="80%"
        display="flex"
        position="absolute"
        p="10"
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          left: 0,
          top: 0,
        }}
      >
        <Button variant="primary" onClick={handleAuthClick} size="medium">
          Sign in
        </Button>
      </Box>
    </Box>
  );
};
