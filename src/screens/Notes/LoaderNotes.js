import { View, StyleSheet,Image } from "react-native";
import React from "react";

export default function LoaderNotes() {
  return (
    <View style={styles.loading}>
      <Image source={require("../../assets/pageTurn.gif")} />
    </View>
  );
}
const styles = StyleSheet.create({
    loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor : '#BEAC84'
    },
})