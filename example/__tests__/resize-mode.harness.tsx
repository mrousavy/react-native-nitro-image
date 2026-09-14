import { screen } from '@react-native-harness/ui'
import { View } from 'react-native'
import { describe, expect, it, render } from 'react-native-harness'
import type { NitroImageProps } from 'react-native-nitro-image'
import { Images, NitroImage } from 'react-native-nitro-image'

/**
 * `resizeMode` is documented to default to `'cover'`, but omitting the prop used
 * to fall through to the platform view's own default instead (`scaleToFill` on
 * iOS, `FIT_CENTER` on Android). See
 * https://github.com/mrousavy/react-native-nitro-image/issues/43.
 *
 * A blank (single-colour) image cannot catch this: every resize mode paints the
 * same solid rectangle. These tests therefore render a *striped, non-square*
 * image into a *square* tile, where each resize mode produces visibly different
 * pixels.
 */

const IMAGE_WIDTH = 20
const IMAGE_HEIGHT = 40
const TILE = { width: 100, height: 100 } as const

/** Four horizontal bands, 10px each, in clearly distinguishable colours. */
const BANDS: Array<[number, number, number]> = [
  [255, 0, 0], // red
  [0, 255, 0], // green
  [0, 0, 255], // blue
  [255, 255, 255], // white
]

/**
 * A 20x40 (portrait) RGBA image made of four horizontal bands.
 *
 * Scaled into a 100x100 tile:
 * - `stretch` squashes it vertically, so all four bands stay visible (25px each).
 * - `cover` scales by 5 to 100x200 and centre-crops, so only the two middle
 *   bands (green, blue) remain visible, 50px each.
 * - `contain` scales by 2.5 to 50x100 and letterboxes horizontally.
 *
 * So each mode is distinguishable from the others by pixels alone.
 */
function createStripedImage() {
  const bytes = new Uint8Array(IMAGE_WIDTH * IMAGE_HEIGHT * 4)
  for (let y = 0; y < IMAGE_HEIGHT; y++) {
    const band = BANDS[Math.floor(y / (IMAGE_HEIGHT / BANDS.length))]
    if (band == null) throw new Error(`No band for row ${y}!`)
    const [r, g, b] = band
    for (let x = 0; x < IMAGE_WIDTH; x++) {
      const i = (y * IMAGE_WIDTH + x) * 4
      bytes[i] = r
      bytes[i + 1] = g
      bytes[i + 2] = b
      bytes[i + 3] = 255
    }
  }
  return Images.loadFromRawPixelData(
    {
      buffer: bytes.buffer,
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      pixelFormat: 'RGBA',
    },
    false,
  )
}

/** Number of differing bytes between two PNG screenshots of the same size. */
function countDifferingBytes(a: Uint8Array, b: Uint8Array): number {
  if (a.length !== b.length) return Math.max(a.length, b.length)
  let differing = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) differing++
  }
  return differing
}

/**
 * Renders one tile - the striped image inside a 100x100 square - with the given
 * `resizeMode`, and returns a screenshot of it. `undefined` means the prop is
 * not passed at all, which is the case under test.
 */
async function screenshotTile(
  testID: string,
  resizeMode?: NitroImageProps['resizeMode'],
) {
  const image = createStripedImage()
  await render(
    <View testID={testID} style={TILE}>
      <NitroImage image={image} style={TILE} resizeMode={resizeMode} />
    </View>,
  )
  const tile = await screen.findByTestId(testID)
  const shot = await screen.screenshot(tile)
  if (shot == null) throw new Error(`Failed to screenshot <${testID} />!`)
  return shot
}

describe('NitroImage view - default resizeMode', () => {
  it('renders an omitted resizeMode exactly like resizeMode="cover"', async () => {
    const omitted = await screenshotTile('resize-mode-omitted')
    const cover = await screenshotTile('resize-mode-cover', 'cover')

    // The actual regression assertion: no `resizeMode` must render identically
    // to `resizeMode="cover"`. Before the fix the omitted one was stretched, so
    // it showed all four bands while `cover` showed only the middle two.
    expect(countDifferingBytes(omitted.data, cover.data)).toBe(0)

    // Both renders are additionally locked against a single committed baseline,
    // so a future change to what `cover` itself means is caught as well. The
    // small tolerance only absorbs anti-aliasing along the one colour boundary;
    // a different resize mode moves ~50% of the pixels.
    const snapshot = {
      name: 'nitro-image-resize-mode-default-cover',
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
    } as const
    await expect(cover).toMatchImageSnapshot(snapshot)
    await expect(omitted).toMatchImageSnapshot(snapshot)
  })

  it('still defaults to cover after a View that set a different resizeMode', async () => {
    // NitroImage views are recycled (`HybridNitroImageViewComponent`
    // `shouldBeRecycled` / `RecyclableView`). A recycled view keeps the resize
    // mode the previous View set, and an omitted `resizeMode` never overwrites
    // it - so without a reset on recycle this render inherits `contain`.
    await screenshotTile('resize-mode-contain', 'contain')
    const omitted = await screenshotTile('resize-mode-omitted-2')
    const cover = await screenshotTile('resize-mode-cover-2', 'cover')

    expect(countDifferingBytes(omitted.data, cover.data)).toBe(0)
  })

  it('distinguishes cover from stretch, so the assertions above are not vacuous', async () => {
    // If this ever hits 0, the striped fixture stopped being able to tell the
    // resize modes apart and every test above silently became meaningless.
    const cover = await screenshotTile('resize-mode-cover-3', 'cover')
    const stretch = await screenshotTile('resize-mode-stretch', 'stretch')

    expect(countDifferingBytes(cover.data, stretch.data)).toBeGreaterThan(0)
  })
})
