import React from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import colors from "../config/colors";

export default ({ title, loading }) => {

    return loading ? (
        <View style={styles.container}>
            <ActivityIndicator size={75} color={colors.LOADING_CIRCLE} />
            {title && <Text style={styles.text}>{title}</Text>}
        </View>
    )
    : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.WHITE,
        zIndex: 9999
    },
    text: {
        color: colors.BLACK,
        marginTop: 15,
        fontSize: 18
    }
});
