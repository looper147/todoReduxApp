import { Swipeable } from "react-native-gesture-handler";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Appbar, List, Switch, TextInput } from "react-native-paper";
import { Button, Card } from "react-native-paper";
//imported action dispatcher and selector
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  deleteTodo,
  getTodo,
  saveTodo,
  updateTodo,
} from "../store/features/todoSlice";

//navigation tools
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//internationalization tools
import { i18n, textDirection } from "../services/i18n/i18n";

//new todo form
const AddTodo = () => {
  const [newTodo, setNewTodo] = useState("");
  const [validTodo, setValidTodo] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [editMode, setEditMode] = useState(false);

  //use our app dispatch
  const dispatch = useAppDispatch();

  const handleNewTodo = () => {
    setEditMode(!editMode);
    // switchLang();
  };

  const handleCancel = () => {
    setNewTodo("");
    setEditMode(false);
    setValidTodo(true);
    setHelperText("");
  };

  const handleConfirm = () => {
    //validate input
    if (newTodo.trim()) {
      if (newTodo.trim().length >= 4) {
        setValidTodo(true);
        setEditMode(false);
        setNewTodo("");

        dispatch(saveTodo(newTodo));
      } else {
        setValidTodo(false);
        setHelperText(
          i18n.t("homeScreen.helperText.shortError", { minLength: 4 })
        );
        console.log(
          i18n.t("homeScreen.helperText.shortError", { minLength: 4 })
        );
      }
    } else {
      setValidTodo(false);
      setHelperText(i18n.t("homeScreen.helperText.emptyError"));
    }
  };

  return (
    <Card
      mode="elevated"
      contentStyle={{ direction: textDirection === "ltr" ? "ltr" : "rtl" }}
    >
      <Card.Title
        title={i18n.t("homeScreen.newTodo.title")}
        titleVariant="titleLarge"
      />
      <Card.Content>
        <TextInput
          mode="outlined"
          disabled={!editMode}
          label={!validTodo ? helperText : i18n.t("homeScreen.newTodo.addBtn")}
          value={newTodo}
          onChangeText={(todo) => setNewTodo(todo)}
          error={!validTodo}
          style={{
            textAlign: textDirection === "ltr" ? "left" : "right",
          }}
        />
      </Card.Content>
      <Card.Actions
        style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
      >
        {!editMode ? (
          <Button onPress={handleNewTodo}>
            <Text>{i18n.t("homeScreen.newTodo.addBtn")}</Text>
          </Button>
        ) : (
          <>
            <Button onPress={handleCancel} mode="outlined">
              <Text>{i18n.t("homeScreen.newTodo.cancelBtn")}</Text>
            </Button>
            <Button mode="contained" onPress={handleConfirm}>
              <Text>{i18n.t("homeScreen.newTodo.confirmBtn")}</Text>
            </Button>
          </>
        )}
      </Card.Actions>
    </Card>
  );
};

type RootStackParamList = {
  Home: undefined;
  EditTodo: { todo: any };
};

//displaying the list of todos
const TodoList = () => {
  const isRTL = textDirection === "rtl";

  //in order to fetch our list of todos from our store,we have to use `use` app selector
  const todos = useAppSelector((state) => state.todo.todos);

  const dispatch = useAppDispatch();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //when the check button is pressed
  const setComplete = (id: number, complete: boolean) => {
    dispatch(updateTodo({ id: id, updates: { completed: complete } }));
  };

  const handleDelete = (id: number) => {
    console.log("Delete clicked");
    dispatch(deleteTodo(id));
  };

  //todo card component, takes todo object and index to be used later in an iteration
  const renderTodoCard = (todo: any, index: number) => {
    const handleTodoPress = () => {
      //pass the selected todo item as a parameter when navigating to the "Edit todo" screen
      navigation.navigate("EditTodo", { todo });
    };
    return (
      //todo item
      //swipeable to show delete button when the user swipes the todo card
      <Swipeable
        key={index}
        //show the delete button on the left in rtl settings
        renderLeftActions={() => {
          if (isRTL) {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  mode="text"
                  textColor="red"
                  onPress={() => handleDelete(todo.id)}
                >
                  {i18n.t("homeScreen.todoList.deleteBtn")}
                </Button>
              </View>
            );
          } else {
            return null;
          }
        }}
        //show the delete button on the right in ltr settings
        renderRightActions={() => {
          if (!isRTL) {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  mode="text"
                  textColor="red"
                  onPress={() => handleDelete(todo.id)}
                >
                  {i18n.t("homeScreen.todoList.deleteBtn")}
                </Button>
              </View>
            );
          } else {
            return null;
          }
        }}
      >
        <View
          key={index}
          style={{
            margin: 10,
            direction: textDirection === "ltr" ? "ltr" : "rtl",
          }}
        >
          {/*indivdual todo card*/}
          <Card mode="elevated" key={index}>
            <Card.Content>
              <List.Item
                style={{ padding: 20 }}
                title={
                  <>
                    <TouchableOpacity
                      onPress={handleTodoPress}
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        width: "220%",
                      }}
                    >
                      <Text
                        style={
                          todo.completed
                            ? styles.strikethrough
                            : styles.todoText
                        }
                      >
                        {todo.text}
                      </Text>
                    </TouchableOpacity>
                  </>
                }
                right={() => (
                  <TouchableOpacity
                    onPress={() => {
                      setComplete(todo.id, !todo.completed);
                      console.log(`todo.completed: ${todo.completed}`);
                    }}
                  >
                    <List.Icon
                      icon={
                        todos[index]?.completed
                          ? "checkbox-marked"
                          : "checkbox-blank-outline"
                      }
                    />
                  </TouchableOpacity>
                )}
              />
            </Card.Content>
          </Card>
        </View>
      </Swipeable>
    );
  };

  return (
    <View
      style={{
        marginTop: 30,
        direction: textDirection === "ltr" ? "ltr" : "rtl",
      }}
    >
      <Card mode="outlined">
        <Card.Title
          title={i18n.t("homeScreen.todoList.title")}
          titleVariant="titleLarge"
        />
        <Card.Content>
          {/*iterate through the fetched todos and display them in a todo component*/}
          {todos.map((todo: any, index: number) => renderTodoCard(todo, index))}
        </Card.Content>
      </Card>
    </View>
  );
};

const CustomHeader = () => {
  const [isOnSwitch, setisOnSwitch] = useState(false);
  const [languageSwitch, setlanguageSwitch] = useState("en");
  const toggleSwitch = () => {
    languageSwitch === "en" ? setlanguageSwitch("ar") : setlanguageSwitch("en");
    setisOnSwitch(!isOnSwitch);
  };
  return (
    <Appbar.Header mode="small">
      <Appbar.Content title={i18n.t("homeScreen.title")} />
      <Text>{languageSwitch}</Text>
      <Switch value={isOnSwitch} onValueChange={toggleSwitch} />
    </Appbar.Header>
  );
};
const HomeScreen = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getTodo());
  }, []);
  return (
    <ScrollView>
      <CustomHeader />
      <View
        style={{
          flex: 1,
          padding: 10,
          margin: 10,
        }}
      >
        <AddTodo />

        <TodoList />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  todoText: {
    fontSize: 16,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
});

export default HomeScreen;
