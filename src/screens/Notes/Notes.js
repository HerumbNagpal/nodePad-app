import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import storage from "../../storage/storage";
import axios from "axios";
import Button from "../../components/Button";
// import LoaderNotes from "./LoaderNotes";
import LoaderNotes from "./LoaderNotes";
import NoteContainer from "./NoteContainer";

let screenHeight = Dimensions.get("window").height;
let screenWidht = Dimensions.get("window").width;

export default function Notes({ navigation }) {
  // const {email} = route.params
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState([]);
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
      console.log(result);
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
    fetchNotes();
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [email]);

  const fetchNotes = async () => {
    const userData = {
      email: email,
    };
    try {
      const result = await axios.post(
        "https://nodePad-byherumb.onrender.com/notes/findAll",
        userData
      );
      // console.log(result.data.data);
      if (result.data.statusCode === 200) {
        setNotes(result.data.data);
        console.log("notes updated done");
      }
    } catch (error) {console.log(error)}
  };

  return (
    <>
      {isLoading && <LoaderNotes />}
      {!isLoading && (
        <View style={styles.container}>
          <Text style={styles.heading}>Notes</Text>
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
            style={styles.list}
            data={notes}
            renderItem={({ item }) => (
              <NoteContainer
                navigation={navigation}
                title={item.title}
                content={item.content}
                _id={item._id}
              />
            )}
            key={(item) => item._id}
          />

          <TouchableOpacity style={styles.addBtn}>
            <Button
              icon="plus"
              mode="contained"
              color="#4CAF50"
              onPress={() => navigation.navigate("NewNote")}
            >
              Add a new note
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
