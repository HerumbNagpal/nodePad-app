import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import axios from "axios";
import storage from "../storage/storage";


let screenHeight = Dimensions.get("window").height;
let screenWidht = Dimensions.get("window").width;

export default function Register({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignUpPressed();
    }, 1500);
  };
  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    console.log("signing up");
    const userData = {
      username: name.value,
      email: email.value,
      password: password.value,
    };
    try {
      const result = await axios.post(
        "https://nodePad-byherumb.onrender.com/signUp",
        // "http://10.2.10.166:3001/signUp",
        userData
      );
      console.log("api call made");
      console.log(result.data.message);
      if (result.data.message == "Email already in use") {
        console.log("duplicate!");
        setEmail({ ...email, error: result.data.message });
        return;
      } else if (result.data.statusCode === 200) {
        console.log("new user!!!!!!!!");
        storage.save({
          key: "user",
          data: {
            email: email.value,
          },
          expires: 1000 * 3600,
        });

        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container]}>
      <BackButton goBack={navigation.goBack} />
      <Logo />

      <View style={styles.circle}>
        <Header>Welcome.</Header>

        <TextInput
          label="Name"
          returnKeyType="next"
          value={name.value}
          onChangeText={(text) => setName({ value: text, error: "" })}
          error={!!name.error}
          errorText={name.error}
        />
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
        <Button
          mode="contained"
          onPress={handleSignup}
          style={{ marginTop: 24 }}
          disable={
            name.value.length === 0 ||
            email.value.length === 0 ||
            password.value.length === 0
          }
        >
          Sign up
        </Button>
        <View style={styles.row}>
          <Text>Already a user?</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Text style={styles.link}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator color="white" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee3e5",
  },
  circle: {
    // flex: 4/12,
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 500,
    height: 700,
    backgroundColor: "white",
    padding: 20,
    borderTopRightRadius: 250,
    borderTopLeftRadius: 250,
    // borderRadius: 200,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  loader: {
    flex: 1,
    // width: screenHeight,
    width: "100%",
    height: screenHeight,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
});
