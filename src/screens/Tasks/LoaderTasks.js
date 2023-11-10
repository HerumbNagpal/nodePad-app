import { View, StyleSheet,Image } from "react-native";
import React from "react";

export default function LoaderTasks() {
  return (
    <View style={styles.loading}>
        <Image source={require("../../assets/taskDone1.gif")}/>
      {/* <Image source={require("../../../assets/taskDone1.gif")} /> */}
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