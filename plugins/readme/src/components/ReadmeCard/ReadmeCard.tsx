import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { FetchComponent } from '../FetchComponent';
import { ReadmeDialog } from '../ReadmeDialog/ReadmeDialog';
import { useFullViewParam } from '../../hooks/useFullViewParam';

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
  const [isFullViewOpen, setIsFullViewOpen] = useFullViewParam();

  const maxHeight =
    variant === 'fullHeight' ? 'none' : propMaxHeight ?? '235px';

  return (
    <>
      <InfoCard
        title="README"
        variant={variant}
        action={
          variant !== 'fullHeight' ? (
            <IconButton
              onClick={() => setIsFullViewOpen(true)}
              aria-label="Open full view"
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
        open={isFullViewOpen}
        onClose={() => setIsFullViewOpen(false)}
      />
    </>
  );
};
