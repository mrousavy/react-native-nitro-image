
const DEFAULT_COUNT = 200;

export function createImageURLs(count: number = DEFAULT_COUNT, size = 800): string[] {
  return [...Array(count).fill(undefined)].map((_, index) => {
    return `https://picsum.photos/seed/${index + 1}/${size}`;
  });
}
