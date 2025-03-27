import { createEscapedIncludeQuery, jqlQueryBuilder } from './queries';

describe('queries', () => {
  describe('jqlQueryBuilder', () => {
    it('can use all arguments build a query.', async () => {
      const jql = jqlQueryBuilder({
        project: ['BS', 'SB'],
        components: ['comp 1', 'comp 2'],
        query: 'filter=example',
      });
      expect(jql).toBe(
        "project in ('BS','SB') AND component in ('comp 1','comp 2') AND filter=example",
      );
    });

    it('can create a query using only a project as argument.', async () => {
      const jql = jqlQueryBuilder({
        project: ['BS'],
      });
      expect(jql).toBe("project in ('BS')");
    });

    it('can create a query with multiple projects and no components or additional query.', async () => {
      const jql = jqlQueryBuilder({
        project: ['BS', 'SB'],
      });
      expect(jql).toBe("project in ('BS','SB')");
    });

    it('can create a query with an additional query but no components.', async () => {
      const jql = jqlQueryBuilder({
        project: ['BS'],
        query: 'filter=example',
      });
      expect(jql).toBe("project in ('BS') AND filter=example");
    });
  });

  describe('createEscapedIncludeQuery', () => {
    it('creates a query with a single value', () => {
      const query = createEscapedIncludeQuery('affectedVersion', ['3.14']);
      expect(query).toBe("affectedVersion in ('3.14')");
    });

    it('creates a query with multiple values', () => {
      const query = createEscapedIncludeQuery('affectedVersion', [
        '3.14',
        '4.2',
      ]);
      expect(query).toBe("affectedVersion in ('3.14','4.2')");
    });
  });
});
