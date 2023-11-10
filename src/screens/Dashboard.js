import React, { useEffect, useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import storage from "../storage/storage";
import axios from "axios";
import { IconButton } from "react-native-paper";

export default function Dashboard({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bgrIcon, setBgrIcon] = useState(true);

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
      console.log("Frome storage ", result.email);
      setEmail(result.email);
    })
    .catch((err) => {
      console.warn(err.message);
      switch (err.name) {
        case "NotFoundError":
          // TODO;
          break;
        case "ExpiredError":
          // TODO
          break;
      }
    });

  useEffect(() => {
    findUser();
  }, [email]);

  const findUser = async () => {
    const userData = {
      email: email,
    };
    try {
      const result = await axios.post(
        "https://nodePad-byherumb.onrender.com/findUser",
        userData
      );

      console.log("After API call : ", result.data);
      setName(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBrgIcon = () => {
    setBgrIcon(!bgrIcon);
  };

  const handleLogout = () => {
    storage.remove({
      key: 'user'
    });
    navigation.removeListener
    navigation.reset({
      index: 0,
      routes: [{ name: "StartScreen" }],
    })
  }
  // findUser();

  return (
    <View style={styles.container}>
      
      <Logo />
      <Header>Hi, {name} 💫</Header>
      
      {/* <Paragraph>Congratulations you are logged in.</Paragraph> */}
      <TouchableOpacity
        style={styles.smallConatainer}
        onPress={() => navigation.navigate("Notes", { email: email })}
      >
        <Text style={styles.txt}>Notes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.smallConatainer}
        onPress={() => navigation.navigate("Tasks", { email: email })}
      >
        <Text style={styles.txt}>Todos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addCircle} onPress={handleBrgIcon}>
        {bgrIcon ? (
          <Text style={styles.add}>+</Text>
        ) : (
          <Text style={styles.add}> {"\u00D7"} </Text>
        )}
      </TouchableOpacity>

      {!bgrIcon && (
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={{color : "white",fontSize : 20,fontWeight : 'bold'}} >Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  smallConatainer: {
    marginTop: 25,
    width: "70%",
    height: "25%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 20,
  },
  txt: {
    fontSize: 24,
    fontWeight: "bold",
  },
  add: {
    fontSize: 32,
    color: "white",
  },
  addCircle: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: 50,
    width: 50,
    bottom: "7%",
    right: "10%",
    // paddingHorizontal: 8,
    // paddingVertical: 6,
    borderRadius: 100 / 2,
    backgroundColor: "black",
  },
  signOutBtn: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: 50,
    width: "50%",
    left: "20%",
    bottom: "7%",
    // paddingHorizontal: 8,
    // paddingVertical: 6,
    borderRadius: 100 / 2,
    backgroundColor: "black",
  },
});
