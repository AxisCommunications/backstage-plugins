import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { ReadmeContent } from '../ReadmeContent';
import { ReadmeDialog } from '../ReadmeDialog/ReadmeDialog';
import { useFullViewParam } from '../../hooks/useFullViewParam';
import { useReadmeContent } from '../../hooks/useReadmeContent';
import { ResponseError } from '@backstage/errors';

/**
 * Props for the ReadmeCard component.
 * @public
 */
export type ReadmeCardProps = {
  variant?: InfoCardVariants;
  maxHeight?: string | number;
  hideIfNotFound?: boolean;
};

export const ReadmeCard = (props: ReadmeCardProps) => {
  const {
    variant = 'gridItem',
    maxHeight: propMaxHeight,
    hideIfNotFound,
  } = props;
  const [isFullViewOpen, setIsFullViewOpen] = useFullViewParam();
  const readmeContent = useReadmeContent();

  const maxHeight =
    variant === 'fullHeight' ? 'none' : propMaxHeight ?? '235px';

  if (
    hideIfNotFound &&
    readmeContent.error instanceof ResponseError &&
    readmeContent.error.statusCode === 404
  ) {
    return null;
  }

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
            <ReadmeContent {...readmeContent} />
          </Box>
        </div>
      </InfoCard>

      <ReadmeDialog
        open={isFullViewOpen}
        onClose={() => setIsFullViewOpen(false)}
        {...readmeContent}
      />
    </>
  );
};
