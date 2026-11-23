import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

const md = new MarkdownIt({ html: true });

const TEXT_TOKENS = new Set(['text', 'code_inline', 'code_block', 'fence']);

function htmlToText(html: string): string {
  return md.utils.unescapeAll(
    html
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]*>/g, ' '),
  );
}

/**
 * Converts markdown content to plain text, suitable for search indexing.
 *
 * The content is parsed with markdown-it rather than stripped with regular
 * expressions, so that text which is not markdown emphasis — for example
 * underscores within words — is preserved as-is. Code block and inline code
 * content is kept as text, while markup such as images, links, and HTML tags
 * is reduced to their text content.
 */
export function markdownToText(content: string): string {
  const out: string[] = [];
  const walk = (tokens: Token[]) => {
    for (const t of tokens) {
      if (t.children) {
        walk(t.children);
      } else if (TEXT_TOKENS.has(t.type)) {
        out.push(t.content);
      } else if (t.type === 'html_block' || t.type === 'html_inline') {
        out.push(htmlToText(t.content));
      } else if (t.type === 'softbreak' || t.type === 'hardbreak') {
        out.push(' ');
      }
      // Separate adjacent blocks so that words don't merge
      if (t.block && t.nesting !== 1) {
        out.push(' ');
      }
    }
  };
  walk(md.parse(content, {}));
  return out.join('').replace(/\s+/g, ' ').trim();
}
