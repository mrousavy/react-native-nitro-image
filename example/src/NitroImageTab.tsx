import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
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
                    <NitroWebImage url={url} resizeMode="cover" />
                )}
            />
        </View>
    );
}
