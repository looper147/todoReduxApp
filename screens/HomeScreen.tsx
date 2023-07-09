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
import { List, TextInput } from "react-native-paper";
import { Button, Card } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  deleteTodo,
  getTodo,
  saveTodo,
  updateTodo,
} from "../store/features/todoSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const AddTodo = () => {
  const [newTodo, setNewTodo] = useState("");
  const [validTodo, setValidTodo] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [editMode, setEditMode] = useState(false);

  //use our app dispatch
  const dispatch = useAppDispatch();
  const handleNewTodo = () => {
    setEditMode(!editMode);
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
        setHelperText("Must be at least 4 characters long");
      }
    } else {
      setValidTodo(false);
      setHelperText("Cannot add empty todo");
    }
  };

  return (
    <Card mode="elevated">
      <Card.Title title="Add a new to do" titleVariant="titleLarge" />
      <Card.Content>
        <TextInput
          mode="outlined"
          disabled={!editMode}
          label={!validTodo ? helperText : "New todo"}
          value={newTodo}
          onChangeText={(todo) => setNewTodo(todo)}
          error={!validTodo}
        />
      </Card.Content>
      <Card.Actions>
        {!editMode ? (
          <Button onPress={handleNewTodo}>
            <Text>New todo</Text>
          </Button>
        ) : (
          <>
            <Button onPress={handleCancel} mode="outlined">
              <Text>Cancel</Text>
            </Button>
            <Button mode="contained" onPress={handleConfirm}>
              <Text>Confirm</Text>
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
//list of todos
const TodoList = () => {
  //in order to fetch our list of todos from our store,we have to use `use` app selector
  const todos = useAppSelector((state) => state.todo.todos);

  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const setComplete = (id: number, complete: boolean) => {
    dispatch(updateTodo({ id: id, updates: { completed: complete } }));
  };

  const handleDelete = (id: number) => {
    console.log("Delete clicked");
    dispatch(deleteTodo(id));
  };
  const renderTodoCard = (todo: any, index: number) => {
    const handleTodoPress = () => {
      console.log("todo pressed");
      //pass the selected todo item as a parameter when navigating to the "Edit todo" screen
      navigation.navigate("EditTodo", { todo });
    };
    return (
      <Swipeable
        key={index}
        renderRightActions={() => (
          <View
            style={{
              // backgroundColor: "red",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Button
              mode="text"
              textColor="red"
              onPress={() => handleDelete(todo.id)}
            >
              Delete
            </Button>
          </View>
        )}
      >
        <View key={index} style={{ margin: 10 }}>
          <Card mode="elevated" key={index}>
            <Card.Content>
              {/*nested card*/}
              <List.Item
                style={{ padding: 20 }}
                title={
                  <>
                    <TouchableOpacity onPress={handleTodoPress}>
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
                      // toggleChecked(index);
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
    <View style={{ marginTop: 30 }}>
      <Card mode="outlined">
        <Card.Title title="Todos" titleVariant="titleLarge" />
        <Card.Content>
          {/*nested card*/}
          {todos.map((todo: any, index: number) => renderTodoCard(todo, index))}
        </Card.Content>
      </Card>
    </View>
  );
};
const HomeScreen = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getTodo());
  }, []);
  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 10, margin: 10 }}>
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
