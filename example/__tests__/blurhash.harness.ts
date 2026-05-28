import { describe, expect, it } from 'react-native-harness'
import { Images } from 'react-native-nitro-image'
import {
  BlurHash,
  getAverageColor,
  isBlurhashValid,
} from 'react-native-nitro-image-blurhash'

const RED = { r: 1, g: 0, b: 0, a: 1 }
const BLUE = { r: 0, g: 0, b: 1, a: 1 }

describe('BlurHash - round-trip', () => {
  it('encodes a small image to a BlurHash string', () => {
    const source = Images.createBlankImage(64, 64, true, BLUE).resize(32, 32)
    const hash = BlurHash.encode(source, 4, 3)
    expect(typeof hash).toBe('string')
    expect(hash.length).toBeGreaterThan(0)
    expect(isBlurhashValid(hash)).toEqual({ isValid: true })
  })

  it('decode produces an Image of requested dimensions', () => {
    const source = Images.createBlankImage(64, 64, true, BLUE).resize(32, 32)
    const hash = BlurHash.encode(source, 4, 3)
    const decoded = BlurHash.decode(hash, 16, 24, 1)
    expect(decoded.width).toBe(16)
    expect(decoded.height).toBe(24)
  })

  it('async variants round-trip encode + decode', async () => {
    const source = Images.createBlankImage(64, 64, true, RED).resize(32, 32)
    const hash = await BlurHash.encodeAsync(source, 4, 3)
    const decoded = await BlurHash.decodeAsync(hash, 32, 32, 1)
    expect(decoded.width).toBe(32)
    expect(decoded.height).toBe(32)
  })
})

describe('isBlurhashValid', () => {
  it('returns isValid:true for a freshly produced hash', () => {
    const source = Images.createBlankImage(64, 64, true, BLUE).resize(32, 32)
    const hash = BlurHash.encode(source, 4, 3)
    expect(isBlurhashValid(hash)).toEqual({ isValid: true })
  })

  it('rejects a malformed hash with an errorReason', () => {
    const result = isBlurhashValid('bad')
    expect(result.isValid).toBe(false)
    if (!result.isValid) {
      expect(result.errorReason.length).toBeGreaterThan(0)
    }
  })
})

describe('getAverageColor', () => {
  it('returns r/g/b channels in [0, 1] for a valid hash', () => {
    const source = Images.createBlankImage(64, 64, true, BLUE).resize(32, 32)
    const hash = BlurHash.encode(source, 4, 3)
    const color = getAverageColor(hash)
    expect(color).toBeDefined()
    if (color != null) {
      for (const channel of [color.r, color.g, color.b]) {
        expect(channel).toBeGreaterThanOrEqual(0)
        expect(channel).toBeLessThanOrEqual(1)
      }
    }
  })

  it('returns undefined for a too-short hash', () => {
    expect(getAverageColor('short')).toBeUndefined()
  })
})

describe('BlurHash.clearCosineCache', () => {
  it('does not throw', () => {
    expect(() => BlurHash.clearCosineCache()).not.toThrow()
  })
})
