import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import storage from "../../storage/storage";
import { CommonActions } from "@react-navigation/native";

const screenWidth = Dimensions.get("screen").width;

export default function NewTask({ navigation }) {
  const [email, setEmail] = useState("");
  const [task, setTask] = useState("");

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
      console.log("From new note page", result.email);
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

  const handleAddNew = async () => {
    const userData = {
      email: email,
      task: task,
      completed: 0,
    };
    try {
      const result = await axios.post(
        "https://nodePad-byherumb.onrender.com/todos/add",
        userData
      );

      // console.log(result.data);
      if (result.data.statusCode === 201) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Dashboard" }, { name: "Tasks" }],
          })
        );
      }
    } catch (error) {console.log(error)}
  };

  return (
    <View style={styles.conatiner}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView keyboardDismissMode="on-drag">
          <KeyboardAwareScrollView>
            <TextInput
              multiline
              style={styles.task}
              value={task}
              placeholder="Start writing your chores"
              onChangeText={setTask}
            />
          </KeyboardAwareScrollView>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.btns}>
        <TouchableOpacity
          style={[
            styles.editBtn,
            {
              backgroundColor: task.length === 0 ? "#979797" : "black",
            },
          ]}
          disabled={task.length === 0}
          onPress={handleAddNew}
        >
          <Text style={{ color: "white", textAlign: "center" }}>SAVE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.delBtn} onPress={navigation.goBack}>
          <Text style={{ color: "red", textAlign: "center" }}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  task: {
    fontSize: 24,
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
