

export function createImageURLs(count: number, size = 800): string[] {
  return [...Array(count).fill(undefined)].map(() => {
    const seed = Math.floor(Math.random() * 1000000);
    return `https://picsum.photos/seed/${seed}/${size}`;
  });
}
