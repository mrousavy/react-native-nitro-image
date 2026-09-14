import { describe, expect, it } from 'react-native-harness'
import { Images } from 'react-native-nitro-image'

describe('Images.loadFromSymbol', () => {
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
