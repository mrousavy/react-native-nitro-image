import { describe, expect, it } from 'react-native-harness'
import {
  Images,
  supportsHeicLoading,
  supportsHeicWriting,
  thumbHashFromBase64String,
  thumbHashToBase64String,
} from 'react-native-nitro-image'

const expectTemporaryHeicPath = (path: string) => {
  expect(path.length).toBeGreaterThan(0)
  expect(path.startsWith('/')).toBe(true)
  expect(path.startsWith('file://')).toBe(false)
  expect(path.toLowerCase().endsWith('.heic')).toBe(true)
}

const expectFileUrlFetchable = async (path: string) => {
  const response = await fetch(`file://${path}`)
  const bytes = await response.arrayBuffer()
  expect(bytes.byteLength).toBeGreaterThan(0)
}

describe('ImageUtils - HEIC round-trip', () => {
  it('encodes an image as HEIC, writes it to disk and loads it back', async () => {
    if (!supportsHeicWriting) {
      console.log(
        '[skip] HEIC writing is not supported on this platform — skipping HEIC round-trip',
      )
      return
    }
    if (!supportsHeicLoading) {
      console.log(
        '[skip] HEIC loading is not supported on this platform — skipping HEIC round-trip',
      )
      return
    }

    const original = Images.createBlankImage(48, 32, false, {
      r: 0.1,
      g: 0.7,
      b: 0.4,
      a: 1,
    })

    const encoded = await original.toEncodedImageDataAsync('heic', 80)
    expect(encoded.imageFormat).toBe('heic')
    expect(encoded.width).toBe(48)
    expect(encoded.height).toBe(32)
    expect(encoded.buffer.byteLength).toBeGreaterThan(0)

    const path = await original.saveToTemporaryFileAsync('heic', 80)
    expectTemporaryHeicPath(path)
    await expectFileUrlFetchable(path)

    const reloaded = await Images.loadFromFileAsync(path)
    expect(reloaded.width).toBe(original.width)
    expect(reloaded.height).toBe(original.height)
  })
})

describe('ImageUtils - thumbHash round-trip', () => {
  it('encodes a small image to a thumbHash and converts to base64', () => {
    const image = Images.createBlankImage(64, 64, true, {
      r: 0.5,
      g: 0.2,
      b: 0.8,
      a: 1,
    })
    const small = image.resize(32, 32)
    const hash = small.toThumbHash()
    expect(hash.byteLength).toBeGreaterThan(0)

    const base64 = thumbHashToBase64String(hash)
    expect(base64.length).toBeGreaterThan(0)
    expect(base64).toMatch(/^[A-Za-z0-9+/=]+$/)

    const restored = thumbHashFromBase64String(base64)
    expect(restored.byteLength).toBe(hash.byteLength)
  })

  it('decodes thumbHash bytes back into an Image', () => {
    const image = Images.createBlankImage(32, 32, true, {
      r: 1,
      g: 0,
      b: 0,
      a: 1,
    })
    const hash = image.toThumbHash()
    const decoded = Images.loadFromThumbHash(hash)
    expect(decoded.width).toBeGreaterThan(0)
    expect(decoded.height).toBeGreaterThan(0)
  })
})
