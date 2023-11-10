import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Dimensions } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
// import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
// import { emailValidator } from "../helpers/emailValidator";
// import { passwordValidator } from "../helpers/passwordValidator";
import storage from "../storage/storage";
import axios from "axios";

let screenHeight = Dimensions.get("window").height;
let screenWidht = Dimensions.get("window").width;
export default function Login({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(()=>{
  //   storage
  //   .load({
  //     key: "user",
  //     autoSync: true,
  //     syncInBackground: true,
  //     syncParams: {
  //       extraFetchOptions: {
  //         // blahblah
  //       },
  //       someFlag: true,
  //     },
  //   })
  //   .then((result) => {
  //     console.log(result.email);
  //     setEmail({ ...email, value: result.email });
  //     navigation.navigate('Dashboard')
  //   })
  //   .catch((err) => {
  //     console.warn(err.message);
  //     switch (err.name) {
  //       case "NotFoundError":
  //         // TODO;
  //         break;
  //       case "ExpiredError":
  //         // TODO
  //         break;
  //     }
  //   });
  // },[])

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginPressed();
    }, 1500);
  };

  const onLoginPressed = async () => {
    // const emailError = emailValidator(email.value);
    // const passwordError = passwordValidator(password.value);
    // if (emailError || passwordError) {
    //   setEmail({ ...email, error: emailError });
    //   setPassword({ ...password, error: passwordError });
    //   return;
    // }

    const userData = {
      email: email.value,
      password: password.value,
    };

    try {
      const result = await axios.post(
        "https://nodePad-byherumb.onrender.com/login",
        userData
      );
      console.log(result.data);
      if (result.data.statusCode === 200) {
        //   alert("success");
        storage.save({
          key: "user",
          data: {
            email: email.value,
          },

          expires: 1000 * 3600,
        });

        navigation.navigate("Dashboard");
      } else {
        if (result.data.message === "No user found, Please sign up") {
          setEmail({ ...email, error: result.data.message });
          setPassword({error: "", value : ""})
        } else {
          setPassword({ ...password, error: result.data.message });
        }
      }
    } catch (error) {
      console.log(error);
    }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "Dashboard" }],
    // });
  };

  return (
    <View style={[styles.container]}>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <View style={styles.circle}>
        <Header>Hello.</Header>
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
        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ResetPassword")}
          >
            <Text style={styles.forgot}>Forgot your password ?</Text>
          </TouchableOpacity>
        </View>
        <Button
          disable={email.value.length === 0 || password.value.length === 0}
          mode="contained"
          onPress={handleLogin}
        >
          Log in
        </Button>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={styles.row}>
            <Text>Not a member yet ?</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.replace("Register")}>
              <Text style={styles.link}> Signup!</Text>
            </TouchableOpacity>
          </View>
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
    // height: screenHeight,
    height: screenWidht,
    width: screenWidht,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff8c4",
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
    borderTopRightRadius: 200,
    borderTopLeftRadius: 200,
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
    marginRight: 100,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
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
