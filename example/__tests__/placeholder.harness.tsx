import { screen } from '@react-native-harness/ui'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { describe, expect, it, render, waitFor } from 'react-native-harness'
import { type Image, Images, NativeNitroImage } from 'react-native-nitro-image'
import { WebImages } from 'react-native-nitro-web-image'

const RED = { r: 1, g: 0, b: 0, a: 1 }

const REAL_IMAGE_URL = 'https://picsum.photos/seed/nitro-placeholder/80'

describe('NitroImage view - placeholder', () => {
  it('shows the placeholder until the real image loads, then swaps to it', async () => {
    const placeholder = Images.createBlankImage(80, 80, true, RED)

    function Placeholder() {
      const [image, setImage] = useState<Image | undefined>(undefined)
      useEffect(() => {
        let cancelled = false
        void (async () => {
          const decoded = await WebImages.loadFromURLAsync(REAL_IMAGE_URL, {
            allowHardware: false,
          })
          if (!cancelled) setImage(decoded)
        })()
        return () => {
          cancelled = true
        }
      }, [])
      return (
        <View>
          <View testID="placeholder-tile" style={{ width: 80, height: 80 }}>
            <NativeNitroImage
              image={image}
              placeholder={placeholder}
              style={{ width: 80, height: 80 }}
            />
          </View>
          {image != null && (
            <Text testID="placeholder-tile-loaded">loaded</Text>
          )}
        </View>
      )
    }

    await render(<Placeholder />)
    const tile = await screen.findByTestId('placeholder-tile')

    const before = await screen.screenshot(tile)
    await expect(before).toMatchImageSnapshot({
      name: 'nitro-image-placeholder-before-swap',
    })

    await waitFor(
      async () => {
        const node = screen.queryByTestId('placeholder-tile-loaded')
        expect(node).not.toBeNull()
      },
      { timeout: 20000 },
    )

    const after = await screen.screenshot(tile)
    await expect(after).toMatchImageSnapshot({
      name: 'nitro-image-placeholder-after-swap',
    })
  })
})
