import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NitroImage, useWebImage } from "react-native-nitro-image";
import { createImageURLs } from "./createImageURLs";

function AsyncImageImpl({ url }: { url: string }): React.ReactNode {
    const image = useWebImage(url);
    return (
        <NitroImage style={styles.image} image={image} resizeMode="contain" />
    );
}
const AsyncImage = React.memo(AsyncImageImpl);

export function NitroImageTab() {
    const imageURLs = useMemo(() => createImageURLs(), []);

    return (
        <View>
            <Text>NitroImage Tab</Text>
            <FlatList
                numColumns={4}
                windowSize={3}
                data={imageURLs}
                renderItem={({ item: url }) => <AsyncImage url={url} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: "25%",
        aspectRatio: 1,
    },
});
