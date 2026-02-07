import { Link } from '@backstage/core-components';
import { useAnalytics, useRouteRef } from '@backstage/core-plugin-api';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

/**
 * Props for ReadmeSearchResultListItem
 * @public
 */
export interface ReadmeSearchResultListItemProps {
  result?: {
    title?: string;
    text?: string;
    location?: string;
    entityRef?: string;
    kind?: string;
    namespace?: string;
    name?: string;
  };
  rank?: number;
}

/**
 * Component for displaying README search results
 * @public
 */
export const ReadmeSearchResultListItem = (
  props: ReadmeSearchResultListItemProps,
) => {
  const { result, rank } = props;
  const analytics = useAnalytics();
  const entityRoute = useRouteRef(entityRouteRef);

  if (!result) {
    return null;
  }

  const handleClick = () => {
    analytics.captureEvent('discover', result.title || '', {
      attributes: { to: result.location || '' },
      value: rank,
    });
  };

  // Generate the entity route if we have the necessary information
  const entityLink =
    result.kind && result.namespace && result.name && entityRoute
      ? entityRoute({
          kind: result.kind,
          namespace: result.namespace,
          name: result.name,
        })
      : result.location || '';

  // Truncate text to a reasonable length
  const displayText = result.text
    ? result.text.length > 200
      ? `${result.text.substring(0, 200)}...`
      : result.text
    : '';

  return (
    <Link to={entityLink} onClick={handleClick} underline="none">
      <ListItem alignItems="flex-start" divider>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" component="span">
                {result.title}
              </Typography>
              {result.kind && (
                <Chip label={result.kind} size="small" variant="outlined" />
              )}
            </Box>
          }
          secondary={
            <Box mt={1}>
              <Typography variant="body2" color="textSecondary" component="div">
                {displayText}
              </Typography>
            </Box>
          }
        />
      </ListItem>
    </Link>
  );
};
