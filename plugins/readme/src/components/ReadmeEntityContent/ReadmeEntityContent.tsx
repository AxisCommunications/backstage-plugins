import { ReadmeContent } from '../ReadmeContent';
import { useReadmeContent } from '../../hooks/useReadmeContent';

/**
 * Props for the ReadmeEntityContent component.
 * @public
 */
export type ReadmeEntityContentProps = {
  /**
   * The maximum height of the content area, or `'none'` to show the full
   * content without scrolling. Defaults to `'none'`.
   */
  maxHeight?: string;
};

/**
 * Renders the README of an entity as the main content of an entity page tab.
 *
 * @public
 */
export const ReadmeEntityContent = ({
  maxHeight = 'none',
}: ReadmeEntityContentProps) => {
  const readmeContent = useReadmeContent();

  return (
    <div style={{ overflow: 'auto', maxHeight }}>
      <ReadmeContent {...readmeContent} />
    </div>
  );
};
