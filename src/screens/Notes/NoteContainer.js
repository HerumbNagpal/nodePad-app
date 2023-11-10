import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";

export default function NoteContainer({ navigation, title, content, _id }) {
  const displayTitle = title.length < 20 ? title : title.slice(0, 20) + "...";
  const displayContent =
    content.length < 80 ? content : content.slice(0, 20) + "...";

  const [showNote, setShowNote] = useState(false);
  const openNote = () => {
    setShowNote(true);

    navigation.navigate("ViewOrEditNote", {
      title: title,
      content: content,
      _id: _id,
    });
  };
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={openNote}>
        <Text style={styles.title}>{displayTitle}</Text>
        <Text style={styles.content}>{displayContent}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: 200,
    margin: 20,
    gap: 10,
    padding: 25,
    borderRadius: 8,
    shadowOffset: { width: 3, height: 4 },
  },
  title: {
    fontSize: 22,
    color: "black",
    fontWeight: "600",
    textAlign: "left",
  },
  content: {
    fontSize: 17,
    color: "grey",
    fontWeight: "normal",
    textAlign: "left",
  },
  modalContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
