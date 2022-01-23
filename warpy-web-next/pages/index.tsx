import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@warpy/components";

export default function Index() {
  return (
    <View style={styles.wrapper}>
      <Text size="large" weight="extraBold" color="yellow">
        warpy
      </Text>
      <Text size="small" weight="extraBold" color="info">
        live social voice & video
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    backgroundColor: "#000",
    padding: 30,
  },
});
