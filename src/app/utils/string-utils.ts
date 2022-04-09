export function htmlDecode(input: string): string | null {
  return new DOMParser().parseFromString(input, 'text/html').documentElement
    .textContent;
}

export function capitalizeText(text: string): string {
  return text
    .split(' ')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(' ');
}
