import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { ReadmeSearchResultListItem } from './ReadmeSearchResultListItem';

const result = {
  type: 'readme',
  title: 'My Service - README',
  text: 'A service that does things',
  location: '/catalog/default/component/my-service',
  entityRef: 'component:default/my-service',
  kind: 'Component',
  namespace: 'default',
  name: 'my-service',
};

describe('ReadmeSearchResultListItem', () => {
  it('should render the result title, kind and link', async () => {
    await renderInTestApp(<ReadmeSearchResultListItem result={result} />);

    expect(screen.getByText('My Service - README')).toBeInTheDocument();
    expect(screen.getByText('Component')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/catalog/default/component/my-service',
    );
  });

  it('should render highlighted text', async () => {
    await renderInTestApp(
      <ReadmeSearchResultListItem
        result={result}
        highlight={{
          fields: {
            title: '<m>My Service</m> - README',
            text: 'A <m>service</m> that does things',
          },
          preTag: '<m>',
          postTag: '</m>',
        }}
      />,
    );

    expect(
      screen.getByText('My Service', { selector: 'mark' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('service', { selector: 'mark' }),
    ).toBeInTheDocument();
  });

  it('should render nothing without a result', async () => {
    const { container } = await renderInTestApp(
      <ReadmeSearchResultListItem result={undefined} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render without list item when disabled', async () => {
    await renderInTestApp(
      <ReadmeSearchResultListItem result={result} asListItem={false} />,
    );

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(screen.getByText('My Service - README')).toBeInTheDocument();
  });

  it('should render without a link when disabled', async () => {
    await renderInTestApp(
      <ReadmeSearchResultListItem result={result} asLink={false} />,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('My Service - README')).toBeInTheDocument();
  });
});
