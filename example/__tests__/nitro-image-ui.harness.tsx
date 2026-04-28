import { screen } from '@react-native-harness/ui'
import { View } from 'react-native'
import { describe, expect, it, render, waitFor } from 'react-native-harness'
import { Images, NitroImage } from 'react-native-nitro-image'
import { WebImages } from 'react-native-nitro-web-image'

const RED = { r: 1, g: 0, b: 0, a: 1 }
const GREEN = { r: 0, g: 1, b: 0, a: 1 }
const BLUE = { r: 0, g: 0, b: 1, a: 1 }

describe('NitroImage view - rendering', () => {
  it('renders a red NitroImage and matches the visual snapshot', async () => {
    await render(
      <View testID="red-render" style={{ width: 100, height: 100 }}>
        <NitroImage
          image={Images.createBlankImage(50, 50, true, RED)}
          style={{ width: 100, height: 100 }}
        />
      </View>,
    )

    const tile = await screen.findByTestId('red-render')
    const shot = await screen.screenshot(tile)
    await expect(shot).toMatchImageSnapshot({
      name: 'nitro-image-render-red-tile',
    })
  })

  it('renders a green NitroImage and matches the visual snapshot', async () => {
    const image = Images.createBlankImage(80, 40, true, GREEN)

    await render(
      <View testID="green-render" style={{ width: 80, height: 40 }}>
        <NitroImage image={image} style={{ width: 80, height: 40 }} />
      </View>,
    )

    await waitFor(async () => {
      const node = screen.queryByTestId('green-render')
      expect(node).not.toBeNull()
    })

    const tile = await screen.findByTestId('green-render')
    const shot = await screen.screenshot(tile)
    await expect(shot).toMatchImageSnapshot({
      name: 'nitro-image-render-green-tile',
    })
  })
})

describe('NitroImage view - visual snapshots', () => {
  it('matches image snapshot for a red 100x100 blank image', async () => {
    const image = Images.createBlankImage(100, 100, true, RED)

    await render(
      <View testID="red-tile" style={{ width: 100, height: 100 }}>
        <NitroImage image={image} style={{ width: 100, height: 100 }} />
      </View>,
    )

    const tile = await screen.findByTestId('red-tile')
    const shot = await screen.screenshot(tile)
    await expect(shot).toMatchImageSnapshot({
      name: 'nitro-image-red-100x100',
    })
  })

  it('matches image snapshot for a blue 80x80 blank image', async () => {
    const image = Images.createBlankImage(80, 80, true, BLUE)

    await render(
      <View testID="blue-tile" style={{ width: 80, height: 80 }}>
        <NitroImage image={image} style={{ width: 80, height: 80 }} />
      </View>,
    )

    const tile = await screen.findByTestId('blue-tile')
    const shot = await screen.screenshot(tile)
    await expect(shot).toMatchImageSnapshot({
      name: 'nitro-image-blue-80x80',
    })
  })

  it('renders a cropped sub-region', async () => {
    const source = Images.createBlankImage(160, 160, true, BLUE)
    const cropped = source.crop(20, 20, 100, 100)

    await render(
      <View testID="cropped-tile" style={{ width: 80, height: 80 }}>
        <NitroImage image={cropped} style={{ width: 80, height: 80 }} />
      </View>,
    )

    const tile = await screen.findByTestId('cropped-tile')
    const shot = await screen.screenshot(tile)
    await expect(shot).toMatchImageSnapshot({
      name: 'nitro-image-cropped-blue-80x80',
    })
  })
})

describe('NitroImage view - URL sources', () => {

  const RAW = (filename: string) =>
    `https://raw.githubusercontent.com/riteshshukla04/react-native-nitro-image/main/example/__tests__/__image_snapshots__/android/${filename}`

  it('renders a remote red tile loaded from a URL', async () => {
    const image = await WebImages.loadFromURLAsync(
      RAW('nitro-image-red-100x100.png'),
      { allowHardware: false },
    )

    await render(
      <View testID="url-red-tile" style={{ width: 100, height: 100 }}>
        <NitroImage image={image} style={{ width: 100, height: 100 }} />
      </View>,
    )

    const tile = await screen.findByTestId('url-red-tile')
    const shot = await screen.screenshot(tile)
    await expect(shot).toMatchImageSnapshot({
      name: 'nitro-image-url-red',
    })
  })


  // TODO : Raise a PR To harness to also HardwareBuffer
  it('renders a remote blue tile loaded from a URL', async () => {
    const image = await WebImages.loadFromURLAsync(
      RAW('nitro-image-blue-80x80.png'),
      { allowHardware: false },
    )

    await render(
      <View testID="url-blue-tile" style={{ width: 80, height: 80 }}>
        <NitroImage image={image} style={{ width: 80, height: 80 }} />
      </View>,
    )

    const tile = await screen.findByTestId('url-blue-tile')
    const shot = await screen.screenshot(tile)
    await expect(shot).toMatchImageSnapshot({
      name: 'nitro-image-url-blue',
    })
  })

  it('renders the upstream banner image scaled into a fixed view', async () => {
    const image = await WebImages.loadFromURLAsync(
      'https://raw.githubusercontent.com/mrousavy/react-native-nitro-image/main/img/banner-light.png',
      { allowHardware: false },
    )

    await render(
      <View testID="url-banner" style={{ width: 200, height: 50 }}>
        <NitroImage
          image={image}
          style={{ width: 200, height: 50 }}
          resizeMode="contain"
        />
      </View>,
    )

    const tile = await screen.findByTestId('url-banner')
    const shot = await screen.screenshot(tile)
    await expect(shot).toMatchImageSnapshot({
      name: 'nitro-image-url-banner',
    })
  })
})

describe('Crop correctness', () => {
  it('returns the requested sub-rect dimensions, not source dimensions', () => {
    const source = Images.createBlankImage(200, 200, true, RED)
    const cropped = source.crop(10, 20, 90, 120)
    expect(cropped.width).toBe(80)
    expect(cropped.height).toBe(100)
  })

  it('produces a buffer sized to the requested region', () => {
    const source = Images.createBlankImage(100, 100, true, BLUE)
    const cropped = source.crop(0, 0, 20, 20)
    const raw = cropped.toRawPixelData()
    expect(raw.width).toBe(20)
    expect(raw.height).toBe(20)
    expect(raw.buffer.byteLength).toBe(20 * 20 * 4)
  })
})

describe('Resize correctness', () => {
  it('resized buffer pixel dimensions equal the requested size', () => {
    const source = Images.createBlankImage(100, 100, true, RED)
    const resized = source.resize(40, 30)
    expect(resized.width).toBe(40)
    expect(resized.height).toBe(30)

    const raw = resized.toRawPixelData()
    expect(raw.width).toBe(40)
    expect(raw.height).toBe(30)
    expect(raw.buffer.byteLength).toBe(40 * 30 * 4)
  })

  it('encoded PNG of a resized image reflects the requested dimensions', () => {
    const source = Images.createBlankImage(200, 200, true, GREEN)
    const resized = source.resize(64, 48)
    const encoded = resized.toEncodedImageData('png')
    expect(encoded.width).toBe(64)
    expect(encoded.height).toBe(48)
  })
})

describe('createBlankImage pixel dimensions', () => {
  it('pixel dimensions match the requested width and height', () => {
    const image = Images.createBlankImage(100, 100, true, RED)
    const raw = image.toRawPixelData()
    expect(raw.width).toBe(100)
    expect(raw.height).toBe(100)
    expect(raw.buffer.byteLength).toBe(100 * 100 * 4)
  })
})

describe('Rotate correctness', () => {
  it('rotate(90) of a non-square image swaps dimensions', () => {
    const source = Images.createBlankImage(40, 20, true, GREEN)
    const rotated = source.rotate(90)
    expect(rotated.width).toBe(20)
    expect(rotated.height).toBe(40)
  })

  it('rotate(45) of a square produces an expanded bounding box', () => {
    const source = Images.createBlankImage(100, 100, true, RED)
    const rotated = source.rotate(45)
    expect(rotated.width).toBeGreaterThanOrEqual(140)
    expect(rotated.width).toBeLessThanOrEqual(143)
    expect(rotated.height).toBeGreaterThanOrEqual(140)
    expect(rotated.height).toBeLessThanOrEqual(143)
  })

  it('rotate(180) preserves dimensions', () => {
    const source = Images.createBlankImage(50, 50, true, GREEN)
    const rotated = source.rotate(180)
    expect(rotated.width).toBe(50)
    expect(rotated.height).toBe(50)
    const raw = rotated.toRawPixelData()
    expect(raw.width).toBe(50)
    expect(raw.height).toBe(50)
    expect(raw.buffer.byteLength).toBe(50 * 50 * 4)
  })
})

describe('Chained transforms', () => {
  it('crop -> resize -> rotate(180) yields the requested final size', () => {
    const source = Images.createBlankImage(300, 300, true, RED)
    const out = source.crop(50, 50, 250, 250).resize(64, 64).rotate(180)
    expect(out.width).toBe(64)
    expect(out.height).toBe(64)
    const raw = out.toRawPixelData()
    expect(raw.width).toBe(64)
    expect(raw.height).toBe(64)
  })
})
