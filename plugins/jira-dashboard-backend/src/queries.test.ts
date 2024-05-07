import { jqlQueryBuilder } from './queries';

describe('queries', () => {
  it('can use all arguments build a query.', async () => {
    const jql = jqlQueryBuilder({
      project: 'BS',
      components: ['comp 1', 'comp 2'],
      query: 'filter=example',
    });
    expect(jql).toBe(
      "project in (BS) AND component in ('comp 1','comp 2') AND filter=example",
    );
  });
  it('can create a query using only a project as argument.', async () => {
    const jql = jqlQueryBuilder({
      project: 'BS',
    });
    expect(jql).toBe('project in (BS)');
  });
});
