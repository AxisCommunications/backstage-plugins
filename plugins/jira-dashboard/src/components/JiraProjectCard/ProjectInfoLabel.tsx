import { Box, Text } from '@backstage/ui';

type ProjectInfoLabelProps = {
  label: string;
  value: string;
};

export const ProjectInfoLabel = ({ label, value }: ProjectInfoLabelProps) => {
  return (
    <Box>
      <Text variant="body-large" color="secondary">
        {label}
      </Text>
      <Text as="div" variant="body-large">
        {value}
      </Text>
    </Box>
  );
};
