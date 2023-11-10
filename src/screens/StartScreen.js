import React from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { View } from "react-native";

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <View style={{flex:1,width:'100%',marginTop:500,alignItems : 'center'}} >
        {/* <Logo /> */}
        <Header> nodePad by Herumb</Header>
        <Paragraph>A simple app to create tasks and write notes.</Paragraph>
        <Button mode="contained" onPress={() => navigation.navigate("Login")}>
          Log in
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate("Register")}>
          Sign up
        </Button>
      </View>
    </Background>
  );
}
