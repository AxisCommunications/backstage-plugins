import { Link } from '@backstage/core-components';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';
import type {
  SearchDocument,
  SearchResult,
} from '@backstage/plugin-search-common';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Fragment, type ReactNode } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

/**
 * Props for the ReadmeSearchResultListItem component.
 * @public
 */
export interface ReadmeSearchResultListItemProps {
  /** The search result to render. */
  result?: ReadmeSearchResult;
  /** Highlighting information from the search engine. */
  highlight?: SearchResult['highlight'];
  /** The rank of the result in the result set. */
  rank?: number;
  /** An icon to display next to the result. */
  icon?: ReactNode;
  /** The number of lines of the content preview to show. */
  lineClamp?: number;
  /** Whether to wrap the result in a link to its location. */
  asLink?: boolean;
  /** Whether to render the result as a list item. */
  asListItem?: boolean;
}

/**
 * A search result for a README document.
 * @public
 */
export interface ReadmeSearchResult extends SearchDocument {
  /** The entity reference that the README belongs to. */
  entityRef?: string;
  /** The kind of the entity. */
  kind?: string;
  /** The namespace of the entity. */
  namespace?: string;
  /** The name of the entity. */
  name?: string;
}

/**
 * Renders a search result for the README of a catalog entity, linking to the
 * entity page.
 *
 * @public
 */
export const ReadmeSearchResultListItem = (
  props: ReadmeSearchResultListItemProps,
) => {
  const {
    result,
    highlight,
    icon,
    lineClamp = 3,
    asLink = true,
    asListItem = true,
  } = props;

  if (!result) {
    return null;
  }

  const LinkWrapper = ({ children }: { children: ReactNode }) =>
    asLink ? (
      <Link noTrack to={result.location}>
        {children}
      </Link>
    ) : (
      <Fragment>{children}</Fragment>
    );

  const title = highlight?.fields?.title ? (
    <HighlightedSearchResultText
      text={highlight.fields.title}
      preTag={highlight.preTag || ''}
      postTag={highlight.postTag || ''}
    />
  ) : (
    result.title
  );

  const text = highlight?.fields?.text ? (
    <HighlightedSearchResultText
      text={highlight.fields.text}
      preTag={highlight.preTag || ''}
      postTag={highlight.postTag || ''}
    />
  ) : (
    result.text
  );

  const content = (
    <ListItemText
      primary={
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" component="span">
            {title}
          </Typography>
          {result.kind && <Chip label={result.kind} size="small" />}
        </Box>
      }
      secondary={
        <Typography
          component="div"
          variant="body2"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: lineClamp,
            overflow: 'hidden',
          }}
        >
          {text}
        </Typography>
      }
    />
  );

  if (!asListItem) {
    return <LinkWrapper>{content}</LinkWrapper>;
  }

  return (
    <ListItem alignItems="flex-start">
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <LinkWrapper>{content}</LinkWrapper>
    </ListItem>
  );
};
