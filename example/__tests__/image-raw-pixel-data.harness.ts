import { describe, expect, it } from 'react-native-harness'
import type { PixelFormat, RawPixelData } from 'react-native-nitro-image'
import { Images } from 'react-native-nitro-image'

type Channel = 'r' | 'g' | 'b' | 'a' | 'x'
interface Color {
  r: number
  g: number
  b: number
  a: number
}

/**
 * The literal byte order in memory for each PixelFormat.
 * `x` is a placeholder/padding byte (written as 0xFF, ignored on read).
 */
const FORMAT_CHANNELS: Partial<Record<PixelFormat, Channel[]>> = {
  ARGB: ['a', 'r', 'g', 'b'],
  BGRA: ['b', 'g', 'r', 'a'],
  ABGR: ['a', 'b', 'g', 'r'],
  RGBA: ['r', 'g', 'b', 'a'],
  XRGB: ['x', 'r', 'g', 'b'],
  BGRX: ['b', 'g', 'r', 'x'],
  XBGR: ['x', 'b', 'g', 'r'],
  RGBX: ['r', 'g', 'b', 'x'],
  RGB: ['r', 'g', 'b'],
  BGR: ['b', 'g', 'r'],
}

const FOUR_BYTE_FORMATS: PixelFormat[] = [
  'RGBA',
  'BGRA',
  'ARGB',
  'ABGR',
  'RGBX',
  'BGRX',
  'XRGB',
  'XBGR',
]
const THREE_BYTE_FORMATS: PixelFormat[] = ['RGB', 'BGR']

// A non-square image so a width/height swap or a transpose is observable
// (a square image looks identical transposed).
const WIDTH = 4
const HEIGHT = 8

/**
 * A per-pixel color derived from the pixel's coordinate. This is what makes the
 * tests catch more than channel swaps:
 * - `r` depends only on `x`, `g`/`b` depend only on `y`, so a transpose or a
 *   row-vs-column-major mistake lands the wrong color at a coordinate.
 * - each channel lives in a disjoint value range (r < g < b), so ANY channel
 *   permutation (e.g. R/B swap) pushes a channel out of its expected range.
 * - a stride / row-padding error shifts rows, so `g`/`b` (the y-keyed channels)
 *   no longer match the expected row.
 * Alpha is always fully opaque so premultiplication is a no-op and the exact
 * byte values survive a roundtrip.
 */
function colorAt(x: number, y: number): Color {
  return {
    r: 10 + x * 20, // 10, 30, 50, 70            (range [10, 70])
    g: 90 + y * 8, //  90, 98, ..., 146          (range [90, 146])
    b: 180 + y * 8, // 180, 188, ..., 236        (range [180, 236])
    a: 255,
  }
}

// Corners plus interior points, spanning both axes (and points where x !== y,
// so a transpose is caught).
const SAMPLE_POINTS: Array<[number, number]> = [
  [0, 0],
  [3, 0],
  [0, 7],
  [3, 7],
  [1, 3],
  [2, 5],
]

function makePatternBuffer(format: PixelFormat): ArrayBuffer {
  const channels = FORMAT_CHANNELS[format]
  if (channels == null) throw new Error(`Unsupported format: ${format}`)
  const bytesPerPixel = channels.length
  const bytes = new Uint8Array(WIDTH * HEIGHT * bytesPerPixel)
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const color = colorAt(x, y)
      const offset = (y * WIDTH + x) * bytesPerPixel
      channels.forEach((channel, i) => {
        bytes[offset + i] = channel === 'x' ? 0xff : color[channel]
      })
    }
  }
  return bytes.buffer
}

/**
 * Reads the pixel at (x, y) by interpreting the buffer bytes according to the
 * *declared* `pixelFormat` of the RawPixelData - so a wrong label surfaces as a
 * wrong color.
 */
function readPixel(raw: RawPixelData, x: number, y: number): Color {
  const channels = FORMAT_CHANNELS[raw.pixelFormat]
  if (channels == null) {
    throw new Error(`Exported an unexpected pixelFormat: ${raw.pixelFormat}`)
  }
  const bytesPerPixel = channels.length
  const bytes = new Uint8Array(raw.buffer)
  const offset = (y * raw.width + x) * bytesPerPixel
  const color: Color = { r: 0, g: 0, b: 0, a: 255 }
  channels.forEach((channel, i) => {
    if (channel === 'x') return // padding byte, not a real channel
    color[channel] = bytes[offset + i] ?? 0
  })
  return color
}

function expectPixel(raw: RawPixelData, x: number, y: number, color: Color) {
  const pixel = readPixel(raw, x, y)
  expect(pixel.r).toBe(color.r)
  expect(pixel.g).toBe(color.g)
  expect(pixel.b).toBe(color.b)
  expect(pixel.a).toBe(color.a)
}

function expectMatchesPattern(raw: RawPixelData) {
  expect(raw.width).toBe(WIDTH)
  expect(raw.height).toBe(HEIGHT)
  expect(raw.pixelFormat).not.toBe('unknown')
  for (const [x, y] of SAMPLE_POINTS) {
    expectPixel(raw, x, y, colorAt(x, y))
  }
}

describe('Image - toRawPixelData declares the physical byte order', () => {
  // createBlankImage fills through the platform's own color APIs (ColorInt /
  // UIColor), so the image content is ground truth. The color has well-separated,
  // strictly descending channels (r > g > b), so any channel swap or wrong format
  // label reorders them. We assert the ORDER rather than exact values because the
  // opaque path is backed by RGB_565 (quantized) on Android - exact-value
  // precision is covered by the roundtrip and PNG-cycle tests below.
  const distinct = { r: 240 / 255, g: 150 / 255, b: 60 / 255, a: 1 }
  const expectDistinct = (raw: RawPixelData) => {
    const p = readPixel(raw, 0, 0)
    expect(p.r).toBeGreaterThan(p.g)
    expect(p.g).toBeGreaterThan(p.b)
    expect(p.r).toBeGreaterThan(200)
    expect(p.b).toBeLessThan(120)
  }

  it('exports bytes matching the declared pixelFormat (with alpha)', () => {
    const image = Images.createBlankImage(WIDTH, HEIGHT, true, distinct)
    const raw = image.toRawPixelData()
    expect(raw.width).toBe(WIDTH)
    expect(raw.height).toBe(HEIGHT)
    expect(raw.pixelFormat).not.toBe('unknown')
    expectDistinct(raw)
  })

  it('exports bytes matching the declared pixelFormat (opaque)', () => {
    const image = Images.createBlankImage(WIDTH, HEIGHT, false, distinct)
    const raw = image.toRawPixelData()
    expect(raw.pixelFormat).not.toBe('unknown')
    expectDistinct(raw)
  })
})

describe('Images - loadFromRawPixelData produces correct image content', () => {
  it('loads an RGBA pattern as the correct image (PNG cycle)', () => {
    // Encoding to PNG reads the native image itself (ColorInt / CGImage domain),
    // not the raw buffer - so this independently pins the *load* side. If a load
    // bug and an export bug were canceling out in a plain roundtrip, the codec
    // read here would still expose it.
    const image = Images.loadFromRawPixelData({
      buffer: makePatternBuffer('RGBA'),
      width: WIDTH,
      height: HEIGHT,
      pixelFormat: 'RGBA',
    })
    expect(image.width).toBe(WIDTH)
    expect(image.height).toBe(HEIGHT)

    const png = image.toEncodedImageData('png')
    const decoded = Images.loadFromEncodedImageData(png)
    expectMatchesPattern(decoded.toRawPixelData())
  })
})

describe('Images - raw pixel data roundtrip (load then export)', () => {
  // The exported format may legally differ from the input format (e.g. Android
  // always exports its ARGB_8888 memory layout, which is RGBA) - what must be
  // preserved is the *color at each coordinate*, read through each declared
  // format. The coordinate-keyed pattern on a 4x8 image means this also catches
  // stride/row-padding, transpose and width/height-swap bugs, not just channel
  // permutations.
  for (const format of [...FOUR_BYTE_FORMATS, ...THREE_BYTE_FORMATS]) {
    it(`preserves the pattern through a ${format} roundtrip`, () => {
      const image = Images.loadFromRawPixelData({
        buffer: makePatternBuffer(format),
        width: WIDTH,
        height: HEIGHT,
        pixelFormat: format,
      })
      expect(image.width).toBe(WIDTH)
      expect(image.height).toBe(HEIGHT)
      expectMatchesPattern(image.toRawPixelData())
    })
  }
})
