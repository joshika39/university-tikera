import {configureStore} from '@reduxjs/toolkit';
import {movieApi} from "@/app/movieApi";
import appReducer from "@/app/appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    [movieApi.reducerPath]: movieApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(movieApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch