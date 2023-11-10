import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState } from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";

const screenWidth = Dimensions.get("screen").width;
export default function TaskContainer({
  navigation,
  email,
  task,
  completed,
  _id,
}) {
  const displayTask = task.length < 20 ? task : task.slice(0, 20) + "...";

  const [showTask, setShowTask] = useState(false);
  
  const openTask = () => {
    // setShowTask(!showTask)
    navigation.navigate("ViewTask",{
      _id:_id,
      task: task,
      completed : completed
    })
  };

  const handleTaskComplete = async () => {
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
        navigation.removeListener
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name :"Dashboard"},{ name: "Tasks" }],
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async () => {
    const userData = {
      email: email,
      _id: _id,
    };

    try {
      const result = await axios.post(
        "https://nodePad-byherumb.onrender.com/todos/del",
        userData
      );
      if(result.data.statusCode===200){
        navigation.removeListener
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name :"Dashboard"},{ name: "Tasks" }],
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: !completed ? "white" : "#d4d4d4" },
        ]}
      >
        <TouchableOpacity>
          {!completed ? (
            <MaterialCommunityIcons
              onPress={handleTaskComplete}
              name="checkbox-blank-outline"
              size={24}
              color="black"
            />
          ) : (
            <Ionicons
              name="md-checkbox-outline"
              disabled
              size={24}
              color="black"
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={openTask} style={{ height: "100%", justifyContent: "center" }}>
          <Text
            style={[
              styles.title,
              { textDecorationLine: completed ? "line-through" : "none" },
            ]}
          >
            {displayTask}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.del} onPress={handleDeleteTask}>
          <MaterialIcons
            name="delete-outline"
            size={24}
            color={!completed ? "red" : "grey"}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 90,
    marginVertical: 12,
    width: "100%",
    gap: 10,
    padding: 15,
    borderRadius: 8,
    shadowOffset: { width: 3, height: 4 },
  },
  title: {
    fontSize: 18,
    // height : '100%',
    color: "black",
    fontWeight: "600",
    textAlign: "left",
  },
  del: {
    position: "absolute",
    right: "8%",
  },
});
