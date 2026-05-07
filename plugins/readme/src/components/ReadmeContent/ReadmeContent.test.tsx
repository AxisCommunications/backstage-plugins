import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { ReadmeContent } from './ReadmeContent';
import mockedReadmeContent from '../../../dev/__fixtures__/mockedReadmeContent.json';

describe('ReadmeContent', () => {
  it('should render content', async () => {
    await renderInTestApp(
      <ReadmeContent
        content={mockedReadmeContent as [string, string]}
        loading={false}
        error={undefined}
        location="https://example.com/README.md"
      />,
    );
    expect(
      screen.getByRole('heading', { name: /What is Backstage/i }),
    ).toBeInTheDocument();
  });
});
