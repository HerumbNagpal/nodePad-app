import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import storage from "../../storage/storage";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";
import BackButton from "../../components/BackButton";

const screenWidth = Dimensions.get("screen").width;
export default function ViewOrEditNote({ navigation, route }) {
  const [email, setEmail] = useState("");
  storage
    .load({
      key: "user",
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        someFlag: true,
      },
    })
    .then((result) => {
      // console.log(result);
      setEmail(result.email);
    })
    .catch((err) => {
      console.warn(err.message);
      switch (err.name) {
        case "NotFoundError":
          // TODO;
          break;
        case "ExpiredError":
          // TOD
          break;
      }
    });
  const { title, content, _id } = route.params;
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);

  const textInpRef = useRef(null);
  const focusAtLast = () => {
    const lastSpaceIndex = newContent.lastIndexOf(" ");
    textInpRef.current.setNativeProps({
      selection: {
        start: lastSpaceIndex + 1,
        end: newContent.length,
      },
    });
  };

  const handleUpdate = async () => {
    const userData = {
      email: email,
      _id: _id,
      title: newTitle,
      content: newContent,
    };
    const result = await axios.post(
      "https://nodePad-byherumb.onrender.com/notes/update",
      userData
    );
    console.log(result.data);
    if (result.data.statusCode === 200) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Dashboard" }, { name: "Notes" }],
        })
      );
      // navigation.navigate("Dashboard");
    }
  };
  const handleDel = async () => {
    const userData = {
      email: email,
      _id: _id,
      title: newTitle,
      content: newContent,
    };
    try {
      const result = await axios.post(
        "https://nodePad-byherumb.onrender.com/notes/deleteNote",
        userData
      );
      console.log(result.data);
      if (result.data.statusCode === 200) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Dashboard" }, { name: "Notes" }],
          })
        );
        // navigation.navigate("Dashboard");
      }
    } catch (error) {console.log(error)}
  };

  const handleBtnOne = () => {
    if (!editMode) {
      console.log("editting");
      setEditMode(!editMode);
    } else {
      handleUpdate();
    }
  };

  const handleBtnTwo = () => {
    if (!editMode) {
      handleDel();
    } else {
      setEditMode(!editMode);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.conatiner}>
      <View style={{ position: "absolute", top: "-10%" }}>
        <BackButton goBack={navigation.goBack} />
      </View>
      {!editMode && (
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}

      {editMode && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TextInput
            multiline
            style={styles.title}
            value={newTitle}
            returnKeyLabel="done"
            returnKeyType="done"
            blurOnSubmit={true}
            placeholder="Title"
            onChangeText={setNewTitle}
          />
          <ScrollView keyboardDismissMode="on-drag">
            <KeyboardAwareScrollView>
              <TextInput
                ref={textInpRef}
                onBlur={focusAtLast}
                multiline
                style={styles.content}
                value={newContent}
                placeholder="Start writing"
                onChangeText={setNewContent}
              />
            </KeyboardAwareScrollView>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      <View style={styles.btns}>
        <TouchableOpacity style={styles.editBtn} onPress={handleBtnOne}>
          <Text style={{ color: "white", textAlign: "center" }}>
            {editMode ? "SAVE" : "EDIT"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.delBtn} onPress={handleBtnTwo}>
          <Text style={{ color: "red", textAlign: "center" }}>
            {editMode ? "CANCEL" : "DELETE"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginHorizontal: 30,
    marginTop: 100,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    marginVertical: 25,
    // color : "#4a6987"
  },
  content: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    paddingBottom: 150,
    height: "100%",
    width: screenWidth - 50,
    // backgroundColor : '#fafafa'
  },
  btns: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    position: "absolute",
    bottom: "5%",
    right: 30,
    left: 30,
  },
  editBtn: {
    borderRadius: 10,
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 5,
    width: "40%",
    textAlign: "center",
  },
  delBtn: {
    borderRadius: 10,
    backgroundColor: "#e2e2e2",
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 5,
    width: "40%",
    textAlign: "center",
  },
});
