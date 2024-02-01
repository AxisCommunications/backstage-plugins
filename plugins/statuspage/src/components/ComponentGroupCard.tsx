import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  styled,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ComponentsTable } from './ComponentsTable';
import { ComponentGroupStatusChips } from './ComponentGroupStatusChips';
import { Component, ComponentGroup } from '@axis-backstage/plugin-statuspage-common';

export type ComponentGroupProps = {
  components: Component[];
  componentGroup: ComponentGroup;
  expanded?: boolean;
};

const DenseAccordion = styled(Accordion)({
  margin: '2px',
  borderRadius: '2px',
});

export const ComponentGroupCard = ({
  components,
  componentGroup,
  expanded = false,
}: ComponentGroupProps) => {
  return (
    <DenseAccordion key={componentGroup.id} defaultExpanded={expanded}>
      <AccordionSummary
        style={{ padding: '0 10px !important', display: 'flex !important' }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>{componentGroup.name}</Typography>
        <ComponentGroupStatusChips components={components} />
      </AccordionSummary>
      <AccordionDetails>
        <ComponentsTable components={components} />
      </AccordionDetails>
    </DenseAccordion>
  );
};
