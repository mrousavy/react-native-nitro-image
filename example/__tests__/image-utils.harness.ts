import { describe, it, expect } from 'react-native-harness';
import {
  Images,
  supportsHeicLoading,
  supportsHeicWriting,
  thumbHashToBase64String,
  thumbHashFromBase64String,
} from 'react-native-nitro-image';

describe('ImageUtils - HEIC support flags', () => {
  it('exposes booleans for HEIC loading and writing', () => {
    expect(typeof supportsHeicLoading).toBe('boolean');
    expect(typeof supportsHeicWriting).toBe('boolean');
  });
});

describe('ImageUtils - thumbHash round-trip', () => {
  it('encodes a small image to a thumbHash and converts to base64', () => {
    const image = Images.createBlankImage(64, 64, true, {
      r: 0.5,
      g: 0.2,
      b: 0.8,
      a: 1,
    });
    const small = image.resize(32, 32);
    const hash = small.toThumbHash();
    expect(hash.byteLength).toBeGreaterThan(0);

    const base64 = thumbHashToBase64String(hash);
    expect(typeof base64).toBe('string');
    expect(base64.length).toBeGreaterThan(0);

    const restored = thumbHashFromBase64String(base64);
    expect(restored.byteLength).toBe(hash.byteLength);
  });

  it('decodes thumbHash bytes back into an Image', () => {
    const image = Images.createBlankImage(32, 32, true, {
      r: 1,
      g: 0,
      b: 0,
      a: 1,
    });
    const hash = image.toThumbHash();
    const decoded = Images.loadFromThumbHash(hash);
    expect(decoded.width).toBeGreaterThan(0);
    expect(decoded.height).toBeGreaterThan(0);
  });
});
