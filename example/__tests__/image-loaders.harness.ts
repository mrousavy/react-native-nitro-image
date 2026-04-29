import { Platform } from 'react-native'
import { describe, expect, it } from 'react-native-harness'
import { Images, loadImage } from 'react-native-nitro-image'
import { WebImages } from 'react-native-nitro-web-image'

const RED = { r: 1, g: 0, b: 0, a: 1 }
const GREEN = { r: 0, g: 1, b: 0, a: 1 }
const BLUE = { r: 0, g: 0, b: 1, a: 1 }

const makeRgbaBuffer = (
  width: number,
  height: number,
  [r, g, b, a]: number[],
) => {
  const bytes = new Uint8Array(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    bytes[i * 4 + 0] = r
    bytes[i * 4 + 1] = g
    bytes[i * 4 + 2] = b
    bytes[i * 4 + 3] = a
  }
  return bytes.buffer
}

describe('Images.loadFromRawPixelData', () => {
  it('loads an Image from a manually-constructed RGBA buffer', () => {
    const width = 8
    const height = 6
    const buffer = makeRgbaBuffer(width, height, [255, 0, 0, 255])
    const image = Images.loadFromRawPixelData({
      buffer,
      width,
      height,
      pixelFormat: 'RGBA',
    })
    expect(image.width).toBe(width)
    expect(image.height).toBe(height)
  })

  it('loadFromRawPixelDataAsync resolves with a usable Image', async () => {
    const buffer = makeRgbaBuffer(4, 4, [0, 255, 0, 255])
    const image = await Images.loadFromRawPixelDataAsync({
      buffer,
      width: 4,
      height: 4,
      pixelFormat: 'RGBA',
    })
    const encoded = image.toEncodedImageData('png')
    expect(encoded.buffer.byteLength).toBeGreaterThan(0)
  })
})

describe('Images.loadFromEncodedImageData', () => {
  it('round-trips through PNG bytes', () => {
    const original = Images.createBlankImage(20, 10, true, RED)
    const encoded = original.toEncodedImageData('png')
    const decoded = Images.loadFromEncodedImageData(encoded)
    expect(decoded.width).toBe(original.width)
    expect(decoded.height).toBe(original.height)
  })

  it('async variant decodes JPEG bytes', async () => {
    const original = Images.createBlankImage(32, 32, true, BLUE)
    const encoded = await original.toEncodedImageDataAsync('jpg', 80)
    const decoded = await Images.loadFromEncodedImageDataAsync(encoded)
    expect(decoded.width).toBe(original.width)
    expect(decoded.height).toBe(original.height)
  })
})

describe('Images.loadFromFile', () => {
  it('reloads an image from a temporary JPG file', async () => {
    const original = Images.createBlankImage(40, 24, true, GREEN)
    const path = await original.saveToTemporaryFileAsync('jpg', 90)
    const reloaded = Images.loadFromFile(path)
    expect(reloaded.width).toBe(original.width)
    expect(reloaded.height).toBe(original.height)
  })

  it('async loadFromFileAsync reloads an image from a temporary PNG file', async () => {
    const original = Images.createBlankImage(50, 50, true, RED)
    const path = await original.saveToTemporaryFileAsync('png')
    const reloaded = await Images.loadFromFileAsync(path)
    expect(reloaded.width).toBe(original.width)
    expect(reloaded.height).toBe(original.height)
  })

  it('throws synchronously when the file path does not exist', () => {
    expect(() => Images.loadFromFile('/tmp/does-not-exist.png')).toThrow()
  })

  it('rejects asynchronously when the file path does not exist', async () => {
    await expect(
      Images.loadFromFileAsync('/tmp/does-not-exist-async.png'),
    ).rejects.toBeDefined()
  })
})

describe('Images.loadFromThumbHash', () => {
  it('decodes a ThumbHash buffer back into an Image', () => {
    const source = Images.createBlankImage(64, 64, true, BLUE).resize(32, 32)
    const hash = source.toThumbHash()
    const decoded = Images.loadFromThumbHash(hash)
    expect(decoded.width).toBeGreaterThan(0)
    expect(decoded.height).toBeGreaterThan(0)
  })

  it('async variant decodes the ThumbHash buffer', async () => {
    const source = Images.createBlankImage(64, 64, true, GREEN).resize(32, 32)
    const hash = await source.toThumbHashAsync()
    const decoded = await Images.loadFromThumbHashAsync(hash)
    expect(decoded.width).toBeGreaterThan(0)
    expect(decoded.height).toBeGreaterThan(0)
  })
})

describe('WebImages.loadFromURLAsync', () => {
  const REMOTE_PNG_URL =
    'https://raw.githubusercontent.com/mrousavy/react-native-nitro-image/main/img/banner-light.png'
  const REMOTE_PNG_WIDTH = 1326
  const REMOTE_PNG_HEIGHT = 336

  it('downloads and decodes an image from a URL with the expected dimensions', async () => {
    const image = await WebImages.loadFromURLAsync(REMOTE_PNG_URL)
    expect(image.width).toBe(REMOTE_PNG_WIDTH)
    expect(image.height).toBe(REMOTE_PNG_HEIGHT)
  })

  it('rejects when the URL is unreachable', async () => {
    await expect(
      WebImages.loadFromURLAsync('https://pikachu.missing/hello.png'),
    ).rejects.toBeDefined()
  })
})

describe('loadImage with { url }', () => {
  it('resolves a URL source through the high-level loader', async () => {
    const image = await loadImage({
      url: 'https://raw.githubusercontent.com/mrousavy/react-native-nitro-image/main/img/banner-light.png',
    })
    expect(image.width).toBe(1326)
    expect(image.height).toBe(336)
  })
})

describe('Images.loadFromSymbol (iOS only)', () => {
  if (Platform.OS !== 'ios') {
    it.skip('skipped on non-iOS platforms', () => {})
    return
  }

  it('loads an SF Symbol image by name', () => {
    const image = Images.loadFromSymbol('star.fill')
    expect(image.width).toBeGreaterThan(0)
    expect(image.height).toBeGreaterThan(0)
  })

  it('throws for an unknown SF Symbol name', () => {
    expect(() =>
      Images.loadFromSymbol('this.symbol.does.not.exist.anywhere'),
    ).toThrow()
  })
})

describe('loadImage (high-level resolver)', () => {
  it('resolves a { rawPixelData } source', async () => {
    const buffer = makeRgbaBuffer(10, 10, [255, 255, 0, 255])
    const image = await loadImage({
      rawPixelData: { buffer, width: 10, height: 10, pixelFormat: 'RGBA' },
    })
    expect(image.width).toBe(10)
    expect(image.height).toBe(10)
  })

  it('resolves an { encodedImageData } source', async () => {
    const original = Images.createBlankImage(24, 24, true, RED)
    const encoded = original.toEncodedImageData('png')
    const image = await loadImage({ encodedImageData: encoded })
    expect(image.width).toBe(original.width)
    expect(image.height).toBe(original.height)
  })

  it('resolves a { filePath } source', async () => {
    const original = Images.createBlankImage(36, 12, true, GREEN)
    const path = await original.saveToTemporaryFileAsync('png')
    const image = await loadImage({ filePath: path })
    expect(image.width).toBe(original.width)
    expect(image.height).toBe(original.height)
  })

  it('returns the same instance when given an existing Image', async () => {
    const existing = Images.createBlankImage(12, 12, true, BLUE)
    const result = await loadImage(existing)
    expect(result).toBe(existing)
  })
})

describe('Image.renderInto', () => {
  it('composites a smaller image onto a larger canvas at the requested rect', () => {
    const canvas = Images.createBlankImage(100, 100, true, RED)
    const overlay = Images.createBlankImage(20, 20, true, BLUE)
    const composed = canvas.renderInto(overlay, 10, 10, 20, 20)
    expect(composed.width).toBe(100)
    expect(composed.height).toBe(100)
  })

  it('async renderIntoAsync resolves with a composed image', async () => {
    const canvas = Images.createBlankImage(50, 50, true, GREEN)
    const overlay = Images.createBlankImage(10, 10, true, BLUE)
    const composed = await canvas.renderIntoAsync(overlay, 5, 5, 10, 10)
    expect(composed.width).toBe(50)
    expect(composed.height).toBe(50)
  })
})

describe('Image.saveToFileAsync', () => {
  it('writes a PNG to an explicit path that can be reloaded', async () => {
    const original = Images.createBlankImage(28, 28, true, RED)
    const tmpPath = await original.saveToTemporaryFileAsync('png')
    // saveToFileAsync overwrites the file at the given path with the new format.
    await original.saveToFileAsync(tmpPath, 'png')
    const reloaded = await Images.loadFromFileAsync(tmpPath)
    expect(reloaded.width).toBe(original.width)
    expect(reloaded.height).toBe(original.height)
  })
})
