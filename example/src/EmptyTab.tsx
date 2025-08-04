import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { NitroImage } from "react-native-nitro-image";

export function EmptyTab() {
    const [value, setValue] = useState('https://picsum.photos/seed/123/400')

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                <TextInput placeholder="Image URL" value={value} onChangeText={setValue} style={styles.textInput} />
                <NitroImage image={{ url: value }} style={styles.image} />
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        fontWeight: "500",
    },
    textInput: {
        height: 50,
        width: '100%'
    },
    image: {
        width: 400,
        height: 400,
        borderColor: 'grey',
        borderWidth: StyleSheet.hairlineWidth
    }
});
