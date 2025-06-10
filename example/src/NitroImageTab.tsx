import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { HybridImageFactory, NitroImage, Image } from 'react-native-nitro-image';
import { createImageURLs } from './Images';

function AsyncImage({ url }: { url: string }): React.ReactNode {
  const [image, setImage] = useState<Image>();

  useEffect(() => {
    (async () => {
      try {
        console.log(`${url}: Loading...`);
        const i = await HybridImageFactory.loadFromURL(url);
        console.log(`${url}: Loaded ${i.width}x${i.height} image!`);
        setImage(i);
      } catch (error) {
        console.error(`${url}: Failed to load image!`, error);
      }
    })();
  }, [url]);

  return <NitroImage style={styles.image} image={image} />;
}

export function NitroImageTab() {
  const imageURLs = useMemo(() => createImageURLs(100), []);

  return (<View>
    <Text>NitroImage Tab</Text>
    <FlatList
      data={imageURLs}
      renderItem={({ item: url }) => (
        <AsyncImage url={url} />
      )}
    />
  </View>);
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 1,
    borderColor: 'red',
  },
});
