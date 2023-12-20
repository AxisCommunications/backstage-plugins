import { Box, Typography } from '@material-ui/core';
import React from 'react';

const labelColor = '#A9A9A9';

type ProjectInfoLabelProps = {
  label: string;
  value: string;
};

export const ProjectInfoLabel = ({ label, value }: ProjectInfoLabelProps) => {
  return (
    <Box mt={2}>
      <Typography style={{ color: labelColor }}>{label}</Typography>
      <Typography style={{ fontWeight: 800, marginTop: 1.5 }}>
        {value}
      </Typography>
    </Box>
  );
};
