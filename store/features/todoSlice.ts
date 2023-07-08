import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
//npm install axios
import axios from "axios";

const BASE_URL_API = "http://192.168.0.112:3000";
export interface Todo {
  id: number;
  text: string;
}

//structure of the state of this slice
interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

//create async thunk , first parm is unique among other async thunks in the store
//second parm is a regular async function that retrieves our data from the backend database
export const getTodo = createAsyncThunk("todo/get", async (thunkAPI) => {
  const response = await axios.get(`${BASE_URL_API}/todos`);
  const data = response.data;
  return data;
});

export const saveTodo = createAsyncThunk(
  "todo/save",
  async (text: string, thunkAPI) => {
    const response = await axios.post(`${BASE_URL_API}/todos`, { text });
    const data = await response.data;
    return data;
  }
);

//function that comes with reduxjs-toolkit
export const TodoSlice = createSlice({
  name: "todo", //slice name
  initialState,

  //object that contains our actions, actions are functions that can mutate our state
  reducers: {
    //add todo action to add a new todo to our todo list
    addTodo: (state, action: PayloadAction<{ text: string }>) => {
      //payLoadAction that comes from redux toolkit to define the type of parameter to pass through this action
      state.todos.push({
        //like this we insert a new todo in our redux store
        id: state.todos.length,
        text: action.payload.text,
      });
    },
  },
  //adding the async thunk to the slice
  extraReducers: (builder) => {
    //takes two parameters, the name of our thunk and
    //every async thunk has three states:
    /*
     1)first is fulfilled when it returns data without any error
    2)loading state when the async function inside the thunk has not yet been resolved
    3) error state, when async function inside the thunk returned with an error
    */

    builder.addCase(getTodo.fulfilled, (state, action) => {
      state.todos = action.payload; // this payload is the actual todos that has been returned by the async function
    });
    builder.addCase(saveTodo.fulfilled, (state, action) => {
      state.todos.push(action.payload);
    });
  },
});

export default TodoSlice.reducer;
export const { addTodo } = TodoSlice.actions;