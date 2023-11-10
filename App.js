import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/core/theme";
import {
  StartScreen,
  Login,
  Register,
  ResetPassword,
  Dashboard,
  Note,
  Notes,
  Tasks,
  ViewOrEditNote,
  NewNote,
  ViewTask,
  NewTask,
} from "./src/screens";
import { StatusBar } from "expo-status-bar";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />

          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          {/* <Stack.Screen name="ResetPassword" component={ResetPassword} /> */}

          <Stack.Screen name="Dashboard" component={Dashboard} />

          <Stack.Screen name="Notes" component={Notes} />
          <Stack.Screen name="Note" component={Note} />
          <Stack.Screen name="ViewOrEditNote" component={ViewOrEditNote} />
          <Stack.Screen name="NewNote" component={NewNote} />

          <Stack.Screen name="Tasks" component={Tasks} />
          <Stack.Screen name="ViewTask" component={ViewTask} />
          <Stack.Screen name="NewTask" component={NewTask} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </Provider>
  );
}
