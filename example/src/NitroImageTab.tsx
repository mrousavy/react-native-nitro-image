import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HybridImageFactory, NitroImage, Image } from 'react-native-nitro-image';

const URL = 'https://www.gallery-aaldering.com/wp-content/uploads/2021/07/lamborghini-countach-lp5000-quattrovalvole-1986.jpg';

export function NitroImageTab() {
  const [image, setImage] = useState<Image>();

  useEffect(() => {
    (async () => {
      try {
        const i = await HybridImageFactory.loadFromURL(URL);
        console.log(`Loaded ${i.width}x${i.height} image!`);
        setImage(i);
      } catch (error) {
        console.error('Failed to load!', error);
      }
    })();
  }, []);

  return (<View>
    <Text>NitroImage Tab</Text>
    <ScrollView>
      <NitroImage image={image} style={styles.image} />
      <NitroImage image={image} style={styles.image} />
      <NitroImage image={image} style={styles.image} />
      <NitroImage image={image} style={styles.image} />
    </ScrollView>
  </View>);
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: 'red',
  },
});
