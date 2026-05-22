import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { NitroImage } from 'react-native-nitro-image'
import { WebImages } from 'react-native-nitro-web-image'
import { createImageURLs } from './createImageURLs'

// Baseline run: tight cap + no priorities anywhere. 3 MB sits just above the
// 800×800 hero (~2.56 MB decoded RGBA) so it can land in cache, then the
// first thumbnail load should LRU-evict it.
const DEMO_CACHE_BYTES = 3 * 1024 * 1024

console.log(`[CachePriorityTab] platform: ${Platform.OS}`)
console.log(
  `[CachePriorityTab] maxMemoryBytes before: ${WebImages.maxMemoryBytes}`,
)
WebImages.maxMemoryBytes = DEMO_CACHE_BYTES
console.log(
  `[CachePriorityTab] maxMemoryBytes after:  ${WebImages.maxMemoryBytes}`,
)

/**
 * Demonstrates cachePriority. The hero (priority 2) should survive cache
 * pressure while thumbnails (priority 0) churn. With the configured cap,
 * scrolling many thumbs evicts thumbs first; tapping "Reload hero" should
 * give an instant cache hit, while thumbnails that scrolled off may need
 * to be refetched.
 */
export function CachePriorityTab() {
  const heroURL = useMemo(() => `https://picsum.photos/seed/hero/800`, [])
  const thumbnailURLs = useMemo(() => createImageURLs(200), [])
  const [heroNonce, setHeroNonce] = useState(0)

  // Pre-build the {url} objects once so each row's `image` prop has a stable
  // reference across re-renders — otherwise an inline `{ url }` literal would
  // create a new object every render and re-trigger the native `image` setter.
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
