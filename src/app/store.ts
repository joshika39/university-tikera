import {configureStore} from '@reduxjs/toolkit';
import {movieApi} from "@/app/movieApi";
import appReducer from "@/app/appSlice";
import {authApi} from "@/app/authApi";
import {adminApi} from "@/app/adminApi";
import {userApi} from "@/app/userApi";

export const store = configureStore({
  reducer: {
    app: appReducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(movieApi.middleware)
      .concat(authApi.middleware)
      .concat(adminApi.middleware)
      .concat(userApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch