import { describe, expect, it } from 'react-native-harness'
import { Images } from 'react-native-nitro-image'

const makeImage = (w = 32, h = 32) =>
  Images.createBlankImage(w, h, true, { r: 0, g: 1, b: 0, a: 1 })

describe('Image - resize', () => {
  it('resizes synchronously to the requested dimensions', () => {
    const image = makeImage(40, 20)
    const resized = image.resize(20, 10)
    expect(resized.width).toBe(20)
    expect(resized.height).toBe(10)
  })

  it('resizes asynchronously to the requested dimensions', async () => {
    const image = makeImage(40, 20)
    const resized = await image.resizeAsync(80, 40)
    expect(resized.width).toBe(80)
    expect(resized.height).toBe(40)
  })
})

describe('Image - crop', () => {
  it('crops to a sub-region', () => {
    const image = makeImage(100, 100)
    const cropped = image.crop(10, 10, 50, 50)
    expect(cropped.width).toBe(40)
    expect(cropped.height).toBe(40)
  })
})

describe('Image - rotate', () => {
  it('rotates 90 degrees and returns an Image', () => {
    const image = makeImage(40, 20)
    const rotated = image.rotate(90)
    expect(rotated.width).toBeGreaterThan(0)
    expect(rotated.height).toBeGreaterThan(0)
  })

  it('rotates 180 degrees and preserves dimensions', () => {
    const image = makeImage(40, 20)
    const rotated = image.rotate(180)
    expect(rotated.width).toBe(40)
    expect(rotated.height).toBe(20)
  })
})

describe('Image - mirrorHorizontally', () => {
  it('preserves dimensions when mirroring', () => {
    const image = makeImage(30, 20)
    const mirrored = image.mirrorHorizontally()
    expect(mirrored.width).toBe(30)
    expect(mirrored.height).toBe(20)
  })
})

describe('Image - renderInto', () => {
  it('draws at the given position, scaled to the given size', () => {
    const white = { r: 1, g: 1, b: 1, a: 1 }
    const red = { r: 1, g: 0, b: 0, a: 1 }
    const base = Images.createBlankImage(100, 100, true, white)
    const sprite = Images.createBlankImage(10, 10, true, red)

    // Drawn at (20, 20) sized 60x60, so red covers 20..80 on both axes.
    const raw = base.renderInto(sprite, 20, 20, 60, 60).toRawPixelData()

    // Red has two near-zero channels, white has none - in any channel order.
    const bytesPerPixel =
      new Uint8Array(raw.buffer).length / (raw.width * raw.height)
    const isRed = (x: number, y: number) => {
      const offset = (y * raw.width + x) * bytesPerPixel
      const pixel = new Uint8Array(raw.buffer, offset, bytesPerPixel)
      return pixel.filter((channel) => channel < 100).length === 2
    }

    expect(isRed(25, 25)).toBe(true) // near corner, inside either way
    expect(isRed(75, 75)).toBe(true) // far corner, only inside if 60x60 is a size
    expect(isRed(95, 95)).toBe(false) // background
  })
})
