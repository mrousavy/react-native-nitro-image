/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HybridImageFactory } from 'react-native-nitro-image';

const URL = 'https://www.gallery-aaldering.com/wp-content/uploads/2021/07/lamborghini-countach-lp5000-quattrovalvole-1986.jpg';
console.log(HybridImageFactory);

function App(): React.JSX.Element {

  useEffect(() => {
    (async () => {
      try {
      const image = await HybridImageFactory.loadFromURL(URL);
      console.log(`Loaded ${image.width}x${image.height} image!`);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <View style={styles.background}>
      <Text>Hi!</Text>
      <ScrollView />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

export default App;
