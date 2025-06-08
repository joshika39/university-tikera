import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getWeek} from "date-fns";
import {AuthResponse} from "@/app/authApi";

type AppSlice = {
  currentWeek: string;
  user: AuthResponse | null;
}

const initialState: AppSlice = {
  currentWeek: getWeek(new Date(), {weekStartsOn: 1}).toString(),
  user: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthResponse | null>) => {
      state.user = action.payload;
    },
    setCurrentWeek(state, action: PayloadAction<string>) {
      state.currentWeek = action.payload;
    },
    nextWeek(state) {
      state.currentWeek = (parseInt(state.currentWeek) + 1).toString();
    },
    previousWeek(state) {
      state.currentWeek = (parseInt(state.currentWeek) - 1).toString();
    }
  },
});

export const {setCurrentWeek, setUser, nextWeek, previousWeek} = appSlice.actions;

export default appSlice.reducer;