import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { createImageURLs } from './Images';
import FastImage from 'react-native-fast-image';


export function FastImageTab() {
  const imageURLs = useMemo(() => createImageURLs(100), []);

  return (<View>
    <Text>FastImage Tab</Text>
    <FlatList
      data={imageURLs}
      renderItem={({ item: url }) => (
        <FastImage source={{ uri: url }} style={styles.image} />
      )}
    />
  </View>);
}


const styles = StyleSheet.create({
  image: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: 'red',
  },
});
