import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { NitroImage } from "react-native-nitro-image";

export function EmptyTab() {
    const [value, setValue] = useState('https://picsum.photos/seed/123/600')

    return (
        <View style={styles.container}>
            <TextInput placeholder="Image URL" value={value} onChangeText={setValue} style={styles.textInput} />
            <NitroImage image={{ url: value }} style={styles.image} />
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
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    image: {
        width: 350,
        height: 350,
        backgroundColor: 'grey',
        marginTop: 15
    }
});
