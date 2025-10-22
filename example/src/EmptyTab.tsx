import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Images, NitroImage } from "react-native-nitro-image";
import { WebImages } from "react-native-nitro-web-image";

export function EmptyTab() {
    const [value, setValue] = useState('https://picsum.photos/seed/123/600')
    const [x, setX] = useState()

    useEffect(() => {
        (async () => {
            try {
            console.log('1')
            const image = await WebImages.loadFromURLAsync(value)
            console.log('2', image.width, image.height)
            const rawData = await image.toRawPixelDataAsync()
            console.log('3', rawData.buffer.byteLength)
            rawData.pixelFormat = 'BGRA'
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
            <TextInput placeholder="Image URL" value={value} onChangeText={setValue} style={styles.textInput} />
            <NitroImage image={{ url: value }} style={styles.image} />
            {x != null && (<NitroImage image={{ rawPixelData: x }} style={styles.image} />)}
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
        width: 350,
        height: 350,
        borderColor: 'grey',
        borderWidth: StyleSheet.hairlineWidth
    }
});
