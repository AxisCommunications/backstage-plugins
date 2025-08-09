import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ComponentsTable } from './ComponentsTable';
import { ComponentGroupStatusChips } from './ComponentGroupStatusChips';
import type {
  Component,
  ComponentGroup,
} from '@axis-backstage/plugin-statuspage-common';

export type ComponentGroupProps = {
  components: Component[];
  componentGroup: ComponentGroup;
  expanded?: boolean;
};

const DenseAccordion = styled(Accordion)({
  margin: '2px',
  borderRadius: '2px',
});

const DenseAccordionSummary = styled(AccordionSummary)({
  '&.Mui-expanded': {
    minHeight: '48px !important',
  },
});

export const ComponentGroupCard = ({
  components,
  componentGroup,
  expanded = false,
}: ComponentGroupProps) => {
  return (
    <DenseAccordion key={componentGroup.id} defaultExpanded={expanded}>
      <DenseAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{componentGroup.name}</Typography>
        <ComponentGroupStatusChips components={components} />
      </DenseAccordionSummary>
      <AccordionDetails>
        <ComponentsTable components={components} />
      </AccordionDetails>
    </DenseAccordion>
  );
};
