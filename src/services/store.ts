import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingridientsSlice from './slices/ingridientsSlice';
import constructorSlice from './slices/burgerConstructorSlice';
import feedsSlice from './slices/feedsSlice';
import ordersSlice from './slices/ordersSlice';
import userSlice from './slices/userSlice';

const rootReducer = combineReducers({
  user: userSlice,
  orders: ordersSlice,
  ingridients: ingridientsSlice,
  burgerConstructor: constructorSlice,
  feeds: feedsSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
