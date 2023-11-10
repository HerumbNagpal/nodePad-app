import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { theme } from "../core/theme";

export default function Button({ disable, mode, style, ...props }) {
  return (
    <PaperButton
      disabled={disable}
      style={[
        styles.button,
        (backgroundColor = disable ? "#808080" : ""),
        mode === "outlined" && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: "70%",
    marginVertical: 7,
    paddingVertical: 1,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});
