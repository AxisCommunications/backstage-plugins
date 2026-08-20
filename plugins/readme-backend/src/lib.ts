export const isSymLink = (content: string): boolean => {
  return (
    content.length > 0 &&
    !content.includes(' ') &&
    !content.includes('\n') &&
    !content.includes('\r') &&
    !content.includes('\u2028') &&
    !content.includes('\u2029')
  );
};
