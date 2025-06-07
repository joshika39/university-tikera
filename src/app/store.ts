import {configureStore} from '@reduxjs/toolkit';
import {movieApi} from "@/app/movieApi";
import appReducer from "@/app/appSlice";
import {authApi} from "@/app/authApi";
import {adminApi} from "@/app/adminApi";

export const store = configureStore({
  reducer: {
    app: appReducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(movieApi.middleware)
      .concat(authApi.middleware)
      .concat(adminApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch