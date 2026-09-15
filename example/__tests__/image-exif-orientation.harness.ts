import { describe, expect, it } from 'react-native-harness'
import type {
  ImageFormat,
  PixelFormat,
  RawPixelData,
} from 'react-native-nitro-image'
import { Images } from 'react-native-nitro-image'
import {
  EXIF_ORIENTATION_CASES,
  type ExifOrientation,
  type ExifOrientationCase,
  type FixtureColor,
  makeExifOrientationJpeg,
} from './fixtures/exif-orientation'

type Channel = 'r' | 'g' | 'b' | 'a' | 'x'
interface Rgb {
  r: number
  g: number
  b: number
}

const FORMAT_CHANNELS: Partial<Record<PixelFormat, readonly Channel[]>> = {
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

const RIGHT_ORIENTATION = EXIF_ORIENTATION_CASES.find(
  (testCase) => testCase.orientation === 6,
)
if (RIGHT_ORIENTATION == null) {
  throw new Error('Missing EXIF orientation 6 test case')
}

function loadFixture(orientation: ExifOrientation) {
  return Images.loadFromEncodedImageData(makeExifOrientationJpeg(orientation))
}

function readPixel(raw: RawPixelData, x: number, y: number): Rgb {
  const channels = FORMAT_CHANNELS[raw.pixelFormat]
  if (channels == null) {
    throw new Error(`Unsupported pixel format: ${raw.pixelFormat}`)
  }

  const bytes = new Uint8Array(raw.buffer)
  const offset = (Math.floor(y) * raw.width + Math.floor(x)) * channels.length
  const pixel: Rgb = { r: 0, g: 0, b: 0 }

  for (let index = 0; index < channels.length; index++) {
    const channel = channels[index]
    const byte = bytes[offset + index]
    if (channel == null || byte == null) {
      throw new Error(`Pixel (${x}, ${y}) is outside the raw image buffer`)
    }

    if (channel === 'r' || channel === 'g' || channel === 'b') {
      pixel[channel] = byte
    }
  }

  return pixel
}

function expectColor(pixel: Rgb, color: FixtureColor) {
  switch (color) {
    case 'red':
      expect(pixel.r).toBeGreaterThan(180)
      expect(pixel.g).toBeLessThan(80)
      expect(pixel.b).toBeLessThan(80)
      break
    case 'green':
      expect(pixel.r).toBeLessThan(80)
      expect(pixel.g).toBeGreaterThan(160)
      expect(pixel.b).toBeLessThan(80)
      break
    case 'blue':
      expect(pixel.r).toBeLessThan(80)
      expect(pixel.g).toBeLessThan(80)
      expect(pixel.b).toBeGreaterThan(180)
      break
    case 'yellow':
      expect(pixel.r).toBeGreaterThan(180)
      expect(pixel.g).toBeGreaterThan(160)
      expect(pixel.b).toBeLessThan(80)
      break
  }
}

function expectCorners(
  raw: RawPixelData,
  corners: ExifOrientationCase['corners'],
) {
  const points: ReadonlyArray<readonly [number, number]> = [
    [raw.width * 0.25, raw.height * 0.25],
    [raw.width * 0.75, raw.height * 0.25],
    [raw.width * 0.25, raw.height * 0.75],
    [raw.width * 0.75, raw.height * 0.75],
  ]

  for (let index = 0; index < points.length; index++) {
    const point = points[index]
    const color = corners[index]
    if (point == null || color == null) {
      throw new Error(`Missing corner at index ${index}`)
    }
    expectColor(readPixel(raw, point[0], point[1]), color)
  }
}

function expectLogicalRawImage(
  raw: RawPixelData,
  testCase: ExifOrientationCase,
) {
  expect(raw.width).toBe(testCase.width)
  expect(raw.height).toBe(testCase.height)
  expectCorners(raw, testCase.corners)
}

describe('Image - EXIF orientation dimensions', () => {
  for (const testCase of EXIF_ORIENTATION_CASES) {
    it(`reports logical dimensions for orientation ${testCase.orientation} (${testCase.name})`, () => {
      const image = loadFixture(testCase.orientation)
      expect(image.width).toBe(testCase.width)
      expect(image.height).toBe(testCase.height)
    })

    it(`exports logical raw dimensions for orientation ${testCase.orientation} (${testCase.name})`, () => {
      const image = loadFixture(testCase.orientation)
      const raw = image.toRawPixelData()
      expect(raw.width).toBe(image.width)
      expect(raw.height).toBe(image.height)
      expect(raw.width).toBe(testCase.width)
      expect(raw.height).toBe(testCase.height)
    })
  }
})

describe('Image - EXIF orientation pixel layout', () => {
  for (const testCase of EXIF_ORIENTATION_CASES) {
    it(`applies orientation ${testCase.orientation} (${testCase.name}) to raw pixels`, () => {
      const raw = loadFixture(testCase.orientation).toRawPixelData()
      expectCorners(raw, testCase.corners)
    })
  }

  it('applies EXIF orientation through the async loader and raw exporter', async () => {
    const image = await Images.loadFromEncodedImageDataAsync(
      makeExifOrientationJpeg(RIGHT_ORIENTATION.orientation),
    )
    const raw = await image.toRawPixelDataAsync()
    expectLogicalRawImage(raw, RIGHT_ORIENTATION)
  })
})

describe('Image - transforms of EXIF-oriented images', () => {
  it('crops in logical orientation coordinates', () => {
    const image = loadFixture(RIGHT_ORIENTATION.orientation)
    const cropped = image.crop(0, 0, image.width / 2, image.height / 2)
    expect(cropped.width).toBe(RIGHT_ORIENTATION.width / 2)
    expect(cropped.height).toBe(RIGHT_ORIENTATION.height / 2)
  })

  it('crops the visually top-left quadrant', () => {
    const image = loadFixture(RIGHT_ORIENTATION.orientation)
    const cropped = image.crop(0, 0, image.width / 2, image.height / 2)
    const raw = cropped.toRawPixelData()
    expectColor(readPixel(raw, raw.width / 2, raw.height / 2), 'blue')
  })

  it('resizes the logically oriented pixels', () => {
    const resized = loadFixture(RIGHT_ORIENTATION.orientation).resize(40, 60)
    const raw = resized.toRawPixelData()
    expect(raw.width).toBe(40)
    expect(raw.height).toBe(60)
    expectCorners(raw, RIGHT_ORIENTATION.corners)
  })

  it('mirrors the logically oriented pixels horizontally', () => {
    const mirrored = loadFixture(
      RIGHT_ORIENTATION.orientation,
    ).mirrorHorizontally()
    const raw = mirrored.toRawPixelData()
    expect(raw.width).toBe(RIGHT_ORIENTATION.width)
    expect(raw.height).toBe(RIGHT_ORIENTATION.height)
    expectCorners(raw, ['red', 'blue', 'green', 'yellow'])
  })

  it('rotates the logically oriented pixels by 180 degrees', () => {
    const rotated = loadFixture(RIGHT_ORIENTATION.orientation).rotate(180)
    const raw = rotated.toRawPixelData()
    expect(raw.width).toBe(RIGHT_ORIENTATION.width)
    expect(raw.height).toBe(RIGHT_ORIENTATION.height)
    expectCorners(raw, ['green', 'yellow', 'red', 'blue'])
  })
})

describe('Image - encoding EXIF-oriented images', () => {
  const formats: readonly ImageFormat[] = ['jpg', 'png']

  for (const format of formats) {
    it(`bakes EXIF orientation into ${format.toUpperCase()} output`, () => {
      const source = loadFixture(RIGHT_ORIENTATION.orientation)
      const encoded = source.toEncodedImageData(format, 95)
      expect(encoded.width).toBe(RIGHT_ORIENTATION.width)
      expect(encoded.height).toBe(RIGHT_ORIENTATION.height)

      const decoded = Images.loadFromEncodedImageData(encoded)
      expectLogicalRawImage(decoded.toRawPixelData(), RIGHT_ORIENTATION)
    })
  }
})
