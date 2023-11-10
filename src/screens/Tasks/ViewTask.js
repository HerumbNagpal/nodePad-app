import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import storage from "../../storage/storage";
import BackButton from "../../components/BackButton";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";

export default function ViewTask({ navigation, route }) {
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

  const { task, completed, _id } = route.params;

  const handleComplete = async () => {
    const userData = {
      email: email,
      _id: _id,
    };

    try {
      const result = await axios.post(
        "https://nodePad-byherumb.onrender.com/todos/completed",
        userData
      );
      console.log(result.data);
      if (result.data.statusCode === 200) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Dashboard" }, { name: "Tasks" }],
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.conatiner}>
      <View style={{ position: "absolute", top: "-10%" }}>
        <BackButton goBack={navigation.goBack} />
      </View>
      <View>
        <Text style={styles.title}>{task}</Text>
        {/* <Text style={styles.content}>{content}</Text> */}
      </View>
      <View style={styles.btns}>
        <TouchableOpacity
          disabled={completed}
          onPress={handleComplete}
          style={[
            styles.Btn,
            { backgroundColor: completed ? "#d4d4d4" : "black" },
          ]}
        >
          <Text
            style={{
              color: completed ? "black" : "white",
              textAlign: "center",
              fontSize: 18,
            }}
          >
            {completed ? "COMPLETED" : "MARK AS DONE"}
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 25,
    // color : "#4a6987"
  },
  btns: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "5%",
    right: 30,
    left: 30,
  },
  Btn: {
    borderRadius: 10,
    backgroundColor: "black",
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 5,
    width: "100%",
    textAlign: "center",
  },
});
