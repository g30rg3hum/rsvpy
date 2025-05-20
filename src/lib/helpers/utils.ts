export function trimAndCapitalize(str: string): string {
  const trimmedStr = str.trim();
  return trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1);
}

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
