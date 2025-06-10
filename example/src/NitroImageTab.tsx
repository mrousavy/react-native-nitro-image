import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { HybridImageFactory, NitroImage } from 'react-native-nitro-image';

const URL = 'https://www.gallery-aaldering.com/wp-content/uploads/2021/07/lamborghini-countach-lp5000-quattrovalvole-1986.jpg';

export function NitroImageTab() {
  const [image, setImage] = useState();

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

  return <View>
    <Text>NitroImage Tab</Text>
    <NitroImage image={image} />
  </View>;
}
