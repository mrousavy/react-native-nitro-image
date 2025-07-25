import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NitroImage } from "react-native-nitro-image";
import { createImageURLs } from "./createImageURLs";

export function NitroImageTab() {
    const imageURLs = useMemo(() => createImageURLs(), []);

    return (
        <View>
            <Text>NitroImage Tab</Text>
            <FlatList
                numColumns={4}
                windowSize={3}
                data={imageURLs}
                renderItem={({ item: url }) => (
                    <NitroImage
                    image={{ url: url }}
                        style={styles.image}
                      resizeMode="cover" />
                )}
            />
        </View>
    );
}

const styles= StyleSheet.create({
    image: {
        width: '25%',
        aspectRatio: 1
    }
})
