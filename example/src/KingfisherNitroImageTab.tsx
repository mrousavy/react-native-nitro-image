import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NitroImage, useWebImage } from 'react-native-nitro-image';
import { createImageURLs } from './Images';

function KingfisherAsyncImageImpl({ url }: { url: string }): React.ReactNode {
  const image = useWebImage(url, true);
  return <NitroImage style={styles.image} image={image} />;
}
const KingfisherAsyncImage = React.memo(KingfisherAsyncImageImpl);

export function KingfisherNitroImageTab() {
  const imageURLs = useMemo(() => createImageURLs(), []);

  return (<View>
    <Text>NitroImage Tab</Text>
    <FlatList
      numColumns={4}
      windowSize={3}
      data={imageURLs}
      renderItem={({ item: url }) => (
        <KingfisherAsyncImage url={url} />
      )}
    />
  </View>);
}

const styles = StyleSheet.create({
  image: {
    width: '25%',
    aspectRatio: 1,
  },
});
