import { screen } from '@react-native-harness/ui'
import { Text, View } from 'react-native'
import { describe, expect, it, render, waitFor } from 'react-native-harness'
import {
  Images,
  type LocalImageSource,
  useLocalImage,
} from 'react-native-nitro-image'

const RED = { r: 1, g: 0, b: 0, a: 1 }

function Probe({ source }: { source: LocalImageSource | undefined }) {
  const { image, error } = useLocalImage(source)
  if (error != null) {
    return <Text testID="probe-error">{error.message}</Text>
  }
  if (image != null) {
    return (
      <Text testID={`probe-image-${image.width}x${image.height}`}>loaded</Text>
    )
  }
  return <Text testID="probe-idle">idle</Text>
}

describe('useLocalImage', () => {
  it('is idle when source is undefined', async () => {
    await render(
      <View>
        <Probe source={undefined} />
      </View>,
    )
    const node = await screen.findByTestId('probe-idle')
    expect(node).not.toBeNull()
  })

  it('resolves a pre-decoded Image source synchronously to itself', async () => {
    const source = Images.createBlankImage(48, 32, true, RED)
    await render(
      <View>
        <Probe source={source} />
      </View>,
    )
    await waitFor(async () => {
      const node = screen.queryByTestId('probe-image-48x32')
      expect(node).not.toBeNull()
    })
  })

  it('resolves an encodedImageData source to a decoded Image', async () => {
    const source = Images.createBlankImage(
      20,
      10,
      true,
      RED,
    ).toEncodedImageData('png')
    await render(
      <View>
        <Probe source={{ encodedImageData: source }} />
      </View>,
    )
    await waitFor(async () => {
      const node = screen.queryByTestId('probe-image-20x10')
      expect(node).not.toBeNull()
    })
  })

  it('resolves a rawPixelData source to an Image of the requested size', async () => {
    const width = 8
    const height = 6
    const buffer = new Uint8Array(width * height * 4)
    for (let i = 0; i < width * height; i++) {
      buffer[i * 4 + 0] = 255
      buffer[i * 4 + 1] = 0
      buffer[i * 4 + 2] = 0
      buffer[i * 4 + 3] = 255
    }
    await render(
      <View>
        <Probe
          source={{
            rawPixelData: {
              buffer: buffer.buffer,
              width,
              height,
              pixelFormat: 'RGBA',
            },
          }}
        />
      </View>,
    )
    await waitFor(async () => {
      const node = screen.queryByTestId('probe-image-8x6')
      expect(node).not.toBeNull()
    })
  })
})
