import { View } from "react-native";
import { useAppSelector } from "../store/store";
import { TextInput } from "react-native-paper";
import { useState } from "react";

const EditTodoScreen = () => {
  const todos = useAppSelector((state) => state.todo.todos);
  const [editTodo, setEditTodo] = useState(todos[0].text);
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
