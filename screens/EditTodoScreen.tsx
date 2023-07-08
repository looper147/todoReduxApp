import { View } from "react-native";
import { useAppSelector } from "../store/store";
import { TextInput } from "react-native-paper";
import { useState } from "react";

//to access passed todo object from the home screen
import { useRoute } from "@react-navigation/native";

const EditTodoScreen = () => {
  // const todos = useAppSelector((state) => state.todo.todos);
  const route = useRoute();
  const todo = route.params?.todo;
  const [editTodo, setEditTodo] = useState(todo?.text || "");

  return (
    <View style={{ padding: 10, margin: 10 }}>
      <TextInput
        value={editTodo}
        onChangeText={setEditTodo}
        mode="flat"
        style={{ fontSize: 29, padding: 100 }}
      />
    </View>
  );
};
export default EditTodoScreen;
