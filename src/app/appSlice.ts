import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getWeek} from "date-fns";

type AppSlice = {
  currentWeek: string;
}

const initialState: AppSlice = {
  currentWeek: getWeek(new Date()).toString(),
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
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

export const {setCurrentWeek, nextWeek, previousWeek} = appSlice.actions;

export default appSlice.reducer;