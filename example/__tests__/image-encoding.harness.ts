import { describe, expect, it } from 'react-native-harness'
import { Images } from 'react-native-nitro-image'

const makeImage = () =>
  Images.createBlankImage(16, 16, false, { r: 0, g: 0, b: 1, a: 1 })

describe('Image - toRawPixelData', () => {
  it('returns a non-empty pixel buffer with matching dimensions', () => {
    const image = makeImage()
    const raw = image.toRawPixelData()
    expect(raw.width).toBe(16)
    expect(raw.height).toBe(16)
    expect(raw.buffer.byteLength).toBeGreaterThan(0)
    expect(typeof raw.pixelFormat).toBe('string')
  })

  it('toRawPixelDataAsync resolves with pixel data', async () => {
    const image = makeImage()
    const raw = await image.toRawPixelDataAsync()
    expect(raw.buffer.byteLength).toBeGreaterThan(0)
  })
})

describe('Image - toEncodedImageData', () => {
  it('encodes to PNG', () => {
    const image = makeImage()
    const encoded = image.toEncodedImageData('png')
    expect(encoded.imageFormat).toBe('png')
    expect(encoded.width).toBe(16)
    expect(encoded.height).toBe(16)
    expect(encoded.buffer.byteLength).toBeGreaterThan(0)
  })

  it('encodes to JPEG with quality', async () => {
    const image = makeImage()
    const encoded = await image.toEncodedImageDataAsync('jpg', 70)
    expect(encoded.imageFormat).toBe('jpg')
    expect(encoded.buffer.byteLength).toBeGreaterThan(0)
  })
})

describe('Images - loadFromEncodedImageData', () => {
  it('round-trips through PNG encoding', () => {
    const image = makeImage()
    const encoded = image.toEncodedImageData('png')
    const decoded = Images.loadFromEncodedImageData(encoded)
    expect(decoded.width).toBe(image.width)
    expect(decoded.height).toBe(image.height)
  })
})

describe('Image - saveToTemporaryFileAsync', () => {
  it('writes a JPG to a temporary path', async () => {
    const image = makeImage()
    const path = await image.saveToTemporaryFileAsync('jpg', 80)
    expect(typeof path).toBe('string')
    expect(path.length).toBeGreaterThan(0)
  })
})
