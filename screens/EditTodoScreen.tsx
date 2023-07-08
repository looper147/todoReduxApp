import { View } from "react-native";
import { useAppDispatch } from "../store/store";
import { TextInput } from "react-native-paper";
import { useEffect, useState } from "react";

//to access passed todo object from the home screen
import { useRoute, useIsFocused } from "@react-navigation/native";
import { updateTodo } from "../store/features/todoSlice";

interface Todo {
  text: string;
  completed: boolean;
  id: number;
}
const EditTodoScreen = () => {
  // const todos = useAppSelector((state) => state.todo.todos);
  const route = useRoute();
  const todo = route.params?.todo as Todo;
  const [editTodo, setEditTodo] = useState(todo?.text || "");

  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    //update if change occurs
    if (!isFocused && todo.text !== editTodo) {
      //if the back button is hit ,save changes
      const id = todo.id;
      dispatch(updateTodo({ id: id, updates: { text: editTodo } }));
    }
  }, [isFocused]);
  return (
    <View style={{ padding: 10, margin: 10 }}>
      <TextInput
        value={editTodo}
        onChangeText={setEditTodo}
        mode="flat"
        style={{ fontSize: 20, padding: 100 }}
      />
    </View>
  );
};
export default EditTodoScreen;
