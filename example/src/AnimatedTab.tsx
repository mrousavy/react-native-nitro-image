import { useRef } from 'react'
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { NitroAnimatedImageView } from 'react-native-nitro-animated-image'
import { NitroAnimatedImage } from 'react-native-nitro-animated-image'

// GIF
const GIF_URL =
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG1ldDcyNTZ6MjFjdm1mcThwdXVod2syMW1yM2J2ejNlNmZtMHg0ZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fdAGl2TBgQ6nXGVOOk/giphy.gif'
// Animated WebP
const WEBP_URL = 'https://mathiasbynens.be/demo/animated-webp-supported.webp'
// Animated PNG (APNG)
const APNG_URL = 'https://apng.onevcat.com/assets/elephant.png'

export function AnimatedTab() {
  const ref = useRef<NitroAnimatedImageView>(null)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>GIF</Text>
      <NitroAnimatedImage
        ref={ref}
        image={{ url: GIF_URL }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.buttons}>
        <Button title="Stop" onPress={() => ref.current?.stopAnimating()} />
        <Button title="Start" onPress={() => ref.current?.startAnimating()} />
      </View>

      <Text style={styles.label}>Animated WebP</Text>
      <NitroAnimatedImage
        image={{ url: WEBP_URL }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.label}>APNG</Text>
      <NitroAnimatedImage
        image={{ url: APNG_URL }}
        style={styles.image}
        resizeMode="contain"
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  image: {
    width: 300,
    height: 300,
    backgroundColor: 'grey',
  },
  buttons: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
})
