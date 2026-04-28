import { describe, it, expect } from 'react-native-harness';
import { Images } from 'react-native-nitro-image';

describe('Images - createBlankImage', () => {
  it('creates a blank image with the requested dimensions', () => {
    const image = Images.createBlankImage(64, 32, false);
    expect(image.width).toBe(64);
    expect(image.height).toBe(32);
  });

  it('creates a blank image with alpha enabled', () => {
    const image = Images.createBlankImage(16, 16, true);
    expect(image.width).toBe(16);
    expect(image.height).toBe(16);
  });

  it('fills the image with a solid color when fill is provided', () => {
    const image = Images.createBlankImage(8, 8, true, {
      r: 1,
      g: 0,
      b: 0,
      a: 1,
    });
    const raw = image.toRawPixelData();
    expect(raw.width).toBe(8);
    expect(raw.height).toBe(8);
    expect(raw.buffer.byteLength).toBeGreaterThan(0);
  });
});

describe('Images - createBlankImageAsync', () => {
  it('resolves with an Image of the requested size', async () => {
    const image = await Images.createBlankImageAsync(20, 10, false);
    expect(image.width).toBe(20);
    expect(image.height).toBe(10);
  });
});
