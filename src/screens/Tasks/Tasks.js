import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import storage from "../../storage/storage";
import axios from "axios";
import LoaderTasks from "./LoaderTasks";
import TaskContainer from "./TaskContainer";
import Button from "../../components/Button";

let screenHeight = Dimensions.get("window").height;
let screenWidht = Dimensions.get("window").width;

export default function Tasks({ navigation }) {
  const [email, setEmail] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.log("from tasks page : ", result);
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

  useEffect(() => {
    fetchTasks();
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [email]);

  const fetchTasks = async () => {
    const userData = {
      email: email,
    };

    try {
      const result = await axios.post(
        "https://nodePad-byherumb.onrender.com/todos/findAll",
        userData
      );
      // console.log(result.data.data);
      if (result.data.statusCode === 200) {
        setTasks(result.data.data);
        console.log("tasks updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  tasks.sort((a, b) => {
    return a.completed - b.completed;
  });

  return (
    <>
      {isLoading && <LoaderTasks />}
      {!isLoading && (
        <View style={styles.container}>
          <Text style={styles.heading}>Tasks</Text>
          <TouchableOpacity
            style={styles.home}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text
              style={{ fontWeight: "bold", textDecorationLine: "underline" }}
            >
              Home
            </Text>
          </TouchableOpacity>

          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={tasks}
            renderItem={({ item }) => (
              <TaskContainer
                navigation={navigation}
                email={email}
                _id={item._id}
                task={item.task}
                completed={item.completed}
              />
            )}
            key={(item) => item._id}
          />

          <TouchableOpacity style={styles.addBtn}>
            <Button
              icon="plus"
              mode="contained"
              color="#4CAF50"
              onPress={() => navigation.navigate("NewTask")}
            >
              Add a new task
            </Button>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  heading: {
    fontSize: 64,
    fontWeight: "bold",
    marginVertical: 40,
    marginLeft: 4,
    textDecorationLine: "underline",
  },
  home: {
    position: "absolute",
    right: "10%",
    top: "15%",
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
    color: "black",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // height : "fit-content",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: screenHeight,
    width: screenWidht,
    margin: -10,
    backgroundColor: "blue",
  },
});
