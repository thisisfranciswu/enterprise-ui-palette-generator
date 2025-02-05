export function extractStringInsideParentheses(input: string): string[] {
  const regex = /\(([^)]+)\)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}
