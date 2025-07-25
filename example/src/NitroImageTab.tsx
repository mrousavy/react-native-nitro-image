import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NitroWebImage } from "react-native-nitro-image";
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
                    <NitroWebImage
                    // @ts-expect-error types are kinda weird hold on
                    style={styles.image}
                     url={url} resizeMode="cover" />
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
