const DETECT_SYMLINKS_REGEX = '^(w+|.|/|-)+$';

export const isSymLink = (content: string): boolean => {
  const lines = content.split('\n');
  if (lines.length > 1) return false;
  const line = lines[0];
  if (line.includes(' ')) return false;

  const regex = RegExp(DETECT_SYMLINKS_REGEX);
  return regex.test(content);
};
