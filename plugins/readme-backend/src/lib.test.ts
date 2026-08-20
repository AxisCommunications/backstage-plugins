import { isSymLink } from './lib';

describe('isSymLink', () => {
  it('accepts a non-empty single-line path without spaces', () => {
    expect(isSymLink('../docs/README.md')).toBe(true);
  });

  it.each(['', 'README.md\n', 'README file'])('rejects %j', content => {
    expect(isSymLink(content)).toBe(false);
  });
});
