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

  it('crops in display space when the image has a non-up orientation', () => {
    // Fast-flag rotate keeps the cgImage and only flips orientation, giving a
    // non-.up image (same shape as a camera frame / EXIF-tagged JPEG).
    const base = makeImage(40, 20)
    const oriented = base.rotate(90, true)
    expect(oriented.width).toBe(20)
    expect(oriented.height).toBe(40)

    // Crop rect is in display space. Without orientation normalization, iOS
    // clamps it to the 40x20 sensor buffer and returns 20x20 instead of 20x40.
    const cropped = oriented.crop(0, 0, 20, 40)
    expect(cropped.width).toBe(20)
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
