import { configureStore } from "@reduxjs/toolkit";
import { TodoSlice } from "./features/todoSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    todo: TodoSlice.reducer,
  },
});

//to dispatch our actions to the store
export const useAppDispatch: () => typeof store.dispatch = useDispatch;

//retrieve our data from the store
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
