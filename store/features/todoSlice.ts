import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";
//npm install axios
import axios from "axios";

const BASE_URL_API = "http://192.168.0.112:3000";
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

//structure of the state of this slice
interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: null | string | undefined;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
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
    try {
      const response = await axios.post(`${BASE_URL_API}/todos`, {
        text,
        completed: false,
      });
      const data = await response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todo/update",

  async ({ id, updates }: { id: number; updates: Partial<Todo> }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL_API}/todos/${id}`,
        updates
      );
      console.log(`updates: ${updates.completed}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todo/delete",
  async (id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL_API}/todos/${id}`);
      console.log(response.data);
      return id;
    } catch (error) {
      console.error(error);
    }
  }
);
//function that comes with reduxjs-toolkit
export const TodoSlice = createSlice({
  name: "todo", //slice name
  initialState,

  //object that contains our actions, actions are functions that can mutate our state
  reducers: {
    //add todo action to add a new todo to our todo list
    addTodo: (
      state,
      action: PayloadAction<{ text: string; completed: boolean }>
    ) => {
      //payLoadAction that comes from redux toolkit to define the type of parameter to pass through this action
      state.todos.push({
        //like this we insert a new todo in our redux store
        id: state.todos.length,
        text: action.payload.text,
        completed: false,
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

    //pending matcher for the builders
    builder.addMatcher(
      isPending(getTodo, saveTodo, updateTodo, deleteTodo),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    //rejected matcher for the builders
    builder.addMatcher(
      isRejected(getTodo, saveTodo, updateTodo, deleteTodo),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log(state.error);
      }
    );

    //get todo builder
    builder.addCase(getTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = action.payload; // this payload is the actual todos that has been returned by the async function
    });

    //save todo builder

    builder.addCase(saveTodo.fulfilled, (state, action) => {
      state.todos.push(action.payload);
      state.loading = false;
      state.error = null;
    });
    //update todo builder

    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.loading = false;
      const updatedTodo = action.payload;
      // console.log(updatedTodo);
      const index = state.todos.findIndex((todo) => todo.id === updatedTodo.id);
      if (index !== -1) {
        state.todos[index] = updatedTodo;
      }
    });
    //delete todo builder

    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.loading = false;
      const id = action.payload;
      console.log(id);

      state.todos = state.todos.filter((todo) => todo.id !== id);
    });
  },
});

export default TodoSlice.reducer;
export const { addTodo } = TodoSlice.actions;
