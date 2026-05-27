import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { NitroImage, useImage } from 'react-native-nitro-image'
import { ThumbHash } from 'react-native-nitro-image-thumbhash'

const DEFAULT_URL = 'https://picsum.photos/seed/thumbhash/400'

export function ThumbHashTab() {
  const [url, setUrl] = useState(DEFAULT_URL)
  const { image, error } = useImage({ url })

  const encoded = useMemo(() => {
    if (image == null) return null
    try {
      const small = image.resize(100, 100)
      const hash = ThumbHash.encode(small)
      const base64 = ThumbHash.toBase64String(hash)
      const decoded = ThumbHash.decode(hash)
      return { base64, decoded }
    } catch (e) {
      console.warn('ThumbHash encode failed', e)
      return null
    }
  }, [image])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Image URL"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.textInput}
      />

      <Text style={styles.label}>Source</Text>
      <NitroImage image={{ url }} style={styles.image} resizeMode="cover" />

      <Text style={styles.label}>ThumbHash placeholder</Text>
      {encoded != null ? (
        <NitroImage
          image={encoded.decoded}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      <Text style={styles.label}>Base64</Text>
      <Text selectable style={styles.hash}>
        {error != null
          ? `Error: ${error.message}`
          : (encoded?.base64 ?? 'Encoding…')}
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'stretch',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  placeholder: {
    backgroundColor: '#ccc',
  },
  hash: {
    fontFamily: 'Courier',
    fontSize: 12,
    padding: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
  },
})
