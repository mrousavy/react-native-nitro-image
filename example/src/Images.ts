

export function createImageURLs(count: number, size = 800): string[] {
  return [...Array(count).fill(undefined)].map((_, index) => {
    return `https://picsum.photos/seed/${index + 1}/${size}`;
  });
}
