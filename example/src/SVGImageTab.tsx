import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image as RNImage } from "react-native";
import { SVGImages } from "react-native-nitro-svg-image";

const SAMPLE_SVG = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f0f0f0"/>
  <circle cx="100" cy="100" r="80" fill="#3498db"/>
  <circle cx="70" cy="80" r="15" fill="white"/>
  <circle cx="130" cy="80" r="15" fill="white"/>
  <path d="M 60 130 Q 100 160 140 130" stroke="white" stroke-width="8" fill="none"/>
</svg>
`;

export function SVGImageTab() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
            // Render SVG to bitmap
            // const image = SVGImages.renderSVG(SAMPLE_SVG, 400, 400);
            const image =  SVGImages.stringToImage(SAMPLE_SVG);

            // // Save to temp file to display
            image.saveToTemporaryFileAsync("png").then((path) => {
                setImageUri(`file://${path}`);
            });

    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SVG Image Tab</Text>

            {error && (
                <Text style={styles.error}>Error: {error}</Text>
            )}

            {imageUri && (
                <View style={styles.imageContainer}>
                    <Text style={styles.label}>Rendered SVG (400x400):</Text>
                    <RNImage source={{ uri: imageUri }} style={styles.image} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    error: {
        fontSize: 16,
        color: "red",
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 10,
    },
    imageContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderWidth: 1,
        borderColor: "#ccc",
    },
});
