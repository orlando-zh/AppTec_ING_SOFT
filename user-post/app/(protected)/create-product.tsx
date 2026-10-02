import { StyleSheet, View, Text } from "react-native";
import React from "react";

export default function CreateProductScreen() {
    return (
        <View >
            <Text>Hello from create product</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",

    }
})