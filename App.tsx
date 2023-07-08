//redux installation
//npm install react-redux @reduxjs/toolkit

//components library installation
//npm install react-native-paper react-native-safe-area-context@4.5.0

//to start expo on web
/*npx expo install react-native-web@~0.18.10 react-dom@18.2.0
@expo/webpack-config@^18.0.1 */

//react navigation
//npm install @react-navigation/native @react-navigation/stack

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { StyleSheet } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import EditTodoScreen from "./screens/EditTodoScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Edit todo" component={EditTodoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
