/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HybridImageFactory, NitroImage } from 'react-native-nitro-image';

const URL = 'https://www.gallery-aaldering.com/wp-content/uploads/2021/07/lamborghini-countach-lp5000-quattrovalvole-1986.jpg';
console.log(HybridImageFactory);

function App(): React.JSX.Element {
  const [image, setImage] = useState<any>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const i = await HybridImageFactory.loadFromURL(URL);
        console.log(`Loaded ${i.width}x${i.height} image!`);
        setImage(i);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <View style={styles.background}>
      <Text>Hi!</Text>
      {/* @ts-expect-error */}
      <NitroImage image={image} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

export default App;
