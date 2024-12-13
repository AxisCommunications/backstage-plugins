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
 * Creates a jql query string.
 * @public
 */
export const jqlQueryBuilder = ({
  project,
  components,
  query,
}: JqlQueryBuilderArgs) => {
  const projectList = Array.isArray(project) ? project : [project];
  let jql = `project in (${projectList.join(',')})`;
  if (components && components.length > 0) {
    let componentsInclude = '(';
    for (let index = 0; index < components.length; index++) {
      const component = components[index];
      componentsInclude += `'${component}'`;
      // Add either the "," separator or close the parentheses.
      if (index === components.length - 1) {
        componentsInclude += ')';
      } else {
        componentsInclude += ',';
      }
    }
    jql += ` AND component in ${componentsInclude}`;
  }
  if (query) {
    jql += ` AND ${query}`;
  }
  return jql;
};
