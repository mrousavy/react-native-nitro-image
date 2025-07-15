import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { createImageURLs } from "./createImageURLs";

export function FastImageTab() {
    const imageURLs = useMemo(() => createImageURLs(), []);

    return (
        <View>
            <Text>FastImage Tab</Text>
            <FlatList
                numColumns={4}
                windowSize={3}
                data={imageURLs}
                renderItem={({ item: url }) => (
                    <FastImage source={{ uri: url }} style={styles.image} />
                )}
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
