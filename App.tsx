// npx expo install react-native-gesture-handler@~2.9.0 react-native-screens@~3.20.0

//redux installation
//npm install react-redux @reduxjs/toolkit

//components library installation
//npm install react-native-paper react-native-safe-area-context@4.5.0

//to start expo on web
/*npx expo install react-native-web@~0.18.10 react-dom@18.2.0
@expo/webpack-config@^18.0.1 */

//react navigation
//npm install @react-navigation/native @react-navigation/stack
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//redux
import { store } from "./store/store";
import { Provider } from "react-redux";

//screens
import HomeScreen from "./screens/HomeScreen";
import EditTodoScreen from "./screens/EditTodoScreen";

//internationalization
import { i18n } from "./services/i18n/i18n";

//nav stack
const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: i18n.t("homeScreen.title"),
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EditTodo"
              component={EditTodoScreen}
              options={{
                title: i18n.t("editScreen.title"),
                // headerStyle: { flexDirection: "row-reverse" },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}
