import { StyleSheet, Text, View } from 'react-native';


export function EmptyTab() {
  return (<View style={styles.container}>
    <Text style={styles.text}>Select a Tab to display the Images.</Text>
  </View>);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
