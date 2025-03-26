/**
 * Types for the arguments to the jqlQueryBuilder function.
 *
 * @public
 */
export type JqlQueryBuilderArgs = {
  project: string | string[];
  components?: string[];
  query?: string;
};

/**
 *  Creates a partial jql query string using the "in" operator to
 *  include multiple values for a field.
 *
 *  Example:
 *    "affectedVersion in ('3.14', '4.2')"
 *
 * @param field
 * @param values
 */
export const createEscapedIncludeQuery = (field: string, values: string[]) => {
  let query = `${field} in (`;
  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    query += `'${value}'`;
    // Add either the "," separator or close the parentheses.
    if (index === values.length - 1) {
      query += ')';
    } else {
      query += ',';
    }
  }
  return query;
};

/**
 * Builds a JQL (Jira Query Language) query string based on the provided arguments.
 *
 * @public
 */
export const jqlQueryBuilder = ({
  project,
  components,
  query,
}: JqlQueryBuilderArgs) => {
  const projectList = Array.isArray(project) ? project : [project];
  let jql = createEscapedIncludeQuery('project', projectList);
  if (components?.length) {
    jql += ` AND ${createEscapedIncludeQuery('component', components)}`;
  }
  if (query) {
    jql += ` AND ${query}`;
  }
  return jql;
};
