import { useCallback, useMemo, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import { NitroImage } from 'react-native-nitro-image'
import { createImageURLs } from './createImageURLs'

export function CachePriorityTab() {
  const heroURL = useMemo(() => `https://picsum.photos/seed/hero/800`, [])
  const thumbnailURLs = useMemo(() => createImageURLs(200), [])
  const [heroNonce, setHeroNonce] = useState(0)

  const thumbnailSources = useMemo(
    () => thumbnailURLs.map((url) => ({ url })),
    [thumbnailURLs],
  )

  const heroSource = useMemo(() => ({ url: heroURL }), [heroURL])

  const renderItem = useCallback(
    ({ item: source }: { item: { url: string } }) => (
      <NitroImage
        image={source}
        recyclingKey={source.url}
        style={styles.thumb}
        resizeMode="cover"
      />
    ),
    [],
  )

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hero (no cachePriority)</Text>
      <NitroImage
        key={heroNonce}
        image={heroSource}
        cachePriority={2}
        recyclingKey={`${heroURL}#${heroNonce}`}
        style={styles.hero}
        resizeMode="cover"
      />
      <View style={styles.buttonRow}>
        <Text style={styles.counter}>
          Remounted: {heroNonce} • check logcat: 1 SET, {heroNonce} HITs
        </Text>
        <Button
          title="Reload hero"
          onPress={() => setHeroNonce((n) => n + 1)}
        />
      </View>
      <Text style={styles.label}>Thumbnails (no cachePriority)</Text>
      <FlatList
        numColumns={4}
        windowSize={3}
        data={thumbnailSources}
        keyExtractor={(source) => source.url}
        renderItem={renderItem}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: '600',
  },
  hero: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  thumb: {
    width: '25%',
    aspectRatio: 1,
  },
})
