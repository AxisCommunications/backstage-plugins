import { markdownToText } from './markdownToText';

describe('markdownToText', () => {
  it.each([
    [
      'keeps plain text unchanged',
      'Just some plain text.',
      'Just some plain text.',
    ],
    [
      'keeps text of headers without the markers',
      '# My Service\n\n## Setup\n\nSome intro.',
      'My Service Setup Some intro.',
    ],
    [
      'removes bold and italic markers',
      'This is **bold** and *italic* text.',
      'This is bold and italic text.',
    ],
    [
      'preserves underscores within words',
      'The my_service_name variable of another_word here.',
      'The my_service_name variable of another_word here.',
    ],
    [
      'keeps link text but not the URL',
      'See [the docs](https://example.com/docs) for more info.',
      'See the docs for more info.',
    ],
    [
      'keeps image alt text but not the URL',
      'before\n\n![logo](https://example.com/logo.png)\n\nafter',
      'before logo after',
    ],
    [
      'keeps code block content',
      'Install with:\n\n```bash\nnpm install @backstage/cli\n```\n\ndone',
      'Install with: npm install @backstage/cli done',
    ],
    [
      'keeps inline code content',
      'Run `npx backstage-cli` to start.',
      'Run npx backstage-cli to start.',
    ],
    [
      'removes unordered and ordered list markers',
      '- one\n- two\n\n1. three\n2. four',
      'one two three four',
    ],
    [
      'keeps blockquote text without the marker',
      '> quoted text',
      'quoted text',
    ],
    [
      'reduces HTML to its text content',
      '<p>Hello <b>world</b></p>',
      'Hello world',
    ],
    ['drops horizontal rules', 'above\n\n---\n\nbelow', 'above below'],
    [
      'unescapes HTML entities',
      'Use &amp; enjoy &lt;tags&gt;',
      'Use & enjoy <tags>',
    ],
    [
      'removes intraword star emphasis, unlike underscores',
      'a*b*c is emphasis, my_service_name is not',
      'abc is emphasis, my_service_name is not',
    ],
    ['handles empty content', '', ''],
  ])('%s', (_name, input, expected) => {
    expect(markdownToText(input)).toEqual(expected);
  });
});
