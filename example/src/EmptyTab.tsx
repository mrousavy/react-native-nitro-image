import { StyleSheet, Text, View } from 'react-native';


export function EmptyTab() {
  return (<View style={styles.container}>
    <Text style={styles.text}>Select a Tab to display the Images List.</Text>
  </View>);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
});
