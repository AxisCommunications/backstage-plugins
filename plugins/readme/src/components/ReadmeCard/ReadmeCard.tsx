import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { EntityInfoCard } from '@backstage/plugin-catalog-react';
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
  hideIfNotFound?: boolean;
};

/**
 * Props for the legacy MUI-based rendering of ReadmeCard.
 * @deprecated Use {@link ReadmeCardProps} instead.
 * @public
 */
export type ReadmeCardLegacyProps = {
  /** @deprecated Use the new {@link ReadmeCardProps} instead. */
  variant?: InfoCardVariants;
  /** @deprecated Use the new {@link ReadmeCardProps} instead. */
  maxHeight?: string | number;
  hideIfNotFound?: boolean;
};

function isLegacyProps(
  props: ReadmeCardProps | ReadmeCardLegacyProps,
): props is ReadmeCardLegacyProps {
  return 'variant' in props || 'maxHeight' in props;
}

function ReadmeCardLegacy(props: ReadmeCardLegacyProps) {
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
}

function ReadmeCardNew(props: ReadmeCardProps) {
  const { hideIfNotFound } = props;
  const [isFullViewOpen, setIsFullViewOpen] = useFullViewParam();
  const readmeContent = useReadmeContent();

  if (
    hideIfNotFound &&
    readmeContent.error instanceof ResponseError &&
    readmeContent.error.statusCode === 404
  ) {
    return null;
  }

  return (
    <>
      <EntityInfoCard
        title="README"
        headerActions={
          <IconButton
            onClick={() => setIsFullViewOpen(true)}
            aria-label="Open full view"
            title="Open full view"
            size="large"
          >
            <FullscreenIcon />
          </IconButton>
        }
      >
        <div style={{ overflow: 'auto' }}>
          <ReadmeContent {...readmeContent} />
        </div>
      </EntityInfoCard>

      <ReadmeDialog
        open={isFullViewOpen}
        onClose={() => setIsFullViewOpen(false)}
        {...readmeContent}
      />
    </>
  );
}

export const ReadmeCard = (props: ReadmeCardProps | ReadmeCardLegacyProps) => {
  if (isLegacyProps(props)) {
    return <ReadmeCardLegacy {...props} />;
  }
  return <ReadmeCardNew {...props} />;
};
