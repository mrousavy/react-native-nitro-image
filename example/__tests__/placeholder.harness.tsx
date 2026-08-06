import { screen } from '@react-native-harness/ui'
import { View } from 'react-native'
import { describe, expect, it, render, waitFor } from 'react-native-harness'
import { type Image, Images, NativeNitroImage } from 'react-native-nitro-image'
import { WebImages } from 'react-native-nitro-web-image'

const RED = { r: 1, g: 0, b: 0, a: 1 }

const REAL_IMAGE_URL = 'https://picsum.photos/seed/nitro-placeholder/80'

/** Center pixel of a decoded raw buffer with its 4 channels sorted, so the
 *  comparison is invariant to channel order (RGBA/BGRA/ARGB) and alpha position. */
function centerPixel(raw: {
  buffer: ArrayBuffer
  width: number
  height: number
}) {
  const px = new Uint8Array(raw.buffer)
  const i =
    (Math.floor(raw.height / 2) * raw.width + Math.floor(raw.width / 2)) * 4
  return [px[i], px[i + 1], px[i + 2], px[i + 3]].sort((a, b) => a - b)
}

/** Center pixel of a harness screenshot (PNG bytes), decoded via the library under test. */
function screenshotCenterPixel(shot: { data: Uint8Array }) {
  const image = Images.loadFromEncodedImageData({
    buffer: shot.data.buffer as ArrayBuffer,
    width: 0,
    height: 0,
    imageFormat: 'png',
  })
  return centerPixel(image.toRawPixelData())
}

const dist = (a: readonly number[], b: readonly number[]) =>
  a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0)

describe('NitroImage view - placeholder', () => {
  it('paints the placeholder until an image is set, then swaps to it', async () => {
    const placeholder = Images.createBlankImage(80, 80, true, RED)
    const placeholderPixel = centerPixel(placeholder.toRawPixelData())

    // Decode up front so the swap is driven by the re-render, not a network race.
    const realImage = await WebImages.loadFromURLAsync(REAL_IMAGE_URL, {
      allowHardware: false,
    })

    function Tile({ image }: { image?: Image }) {
      return (
        <View testID="placeholder-tile" style={{ width: 80, height: 80 }}>
          <NativeNitroImage
            image={image}
            placeholder={placeholder}
            style={{ width: 80, height: 80 }}
          />
        </View>
      )
    }

    // With no image, the native view shows the placeholder (painted async, so poll).
    await render(<Tile />)
    await waitFor(
      async () => {
        const tile = await screen.findByTestId('placeholder-tile')
        const shot = await screen.screenshot(tile)
        if (shot == null) throw new Error('screenshot returned null')
        expect(
          dist(screenshotCenterPixel(shot), placeholderPixel),
        ).toBeLessThan(60)
      },
      { timeout: 5000 },
    )

    // Setting the image paints it over the placeholder: center no longer matches.
    await render(<Tile image={realImage} />)
    await waitFor(
      async () => {
        const tile = await screen.findByTestId('placeholder-tile')
        const shot = await screen.screenshot(tile)
        if (shot == null) throw new Error('screenshot returned null')
        expect(
          dist(screenshotCenterPixel(shot), placeholderPixel),
        ).toBeGreaterThan(60)
      },
      { timeout: 5000 },
    )
  })
})
