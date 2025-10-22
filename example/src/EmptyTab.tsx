import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Images, NitroImage } from "react-native-nitro-image";
import { WebImages } from "react-native-nitro-web-image";

export function EmptyTab() {
    const [value, setValue] = useState('https://picsum.photos/seed/123/400')
    const [x, setX] = useState()

    useEffect(() => {
        (async () => {
            try {
            console.log('1')
            const image = await WebImages.loadFromURLAsync(value)
            console.log('2', image.width, image.height)
            const rawData = await image.toRawPixelDataAsync()
            console.log('3', rawData.buffer.byteLength)
            setX(rawData)
            const newImage = await Images.loadFromRawPixelDataAsync(rawData)
            console.log('4', newImage.width, newImage.height)
            } catch (e) {
                console.error(e)
            }
        })()

    }, [value])

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                <TextInput placeholder="Image URL" value={value} onChangeText={setValue} style={styles.textInput} />
                {x && (<NitroImage image={{ rawPixelData: x }} style={styles.image} />)}
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
