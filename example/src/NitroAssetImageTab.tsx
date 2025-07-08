import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Image, loadImageFromAssetAsync, NitroImage } from 'react-native-nitro-image';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";


function useAssetImage(
  url: string,
): Image | undefined {
  const [image, setImage] = useState<Image | undefined>(undefined)

  useEffect(() => {
    const load = async () => {
      try {
        const i = await loadImageFromAssetAsync(url.replace(/^ph:\/\//, ""))
        setImage(i)
      } catch (error) {
        console.error(`Failed to load image from "${url}"!`, error)
        setImage(undefined)
      }
    }
    load()
    // `options` is missing from dependencies since it's a reference type that will be constructed each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return image
}
function AsyncImageImpl({ url }: { url: string }): React.ReactNode {
  const image = useAssetImage(url);
  return <NitroImage style={styles.image} image={image} />;
}
const AsyncImage = React.memo(AsyncImageImpl);

export function NitroAssetImageTab() {
  const [imageURLs, setImageURLs] = useState<string[]>([]);


  useEffect(() => {
    CameraRoll.getPhotos({ first: 100,assetType: "Photos" }).then((res) => {
      setImageURLs(res.edges.map((edge) => edge.node.image.uri));
    });
  }, []);

  return (<View>
    <Text>NitroMediaLibraryImage Tab</Text>
    <FlatList
      numColumns={4}
      windowSize={3}
      data={imageURLs}
      renderItem={({ item: url }) => (
        <AsyncImage url={url} />
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
