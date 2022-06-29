import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

const initialState = {
    mode: "",
    color: ""
};

const themesSlice = createSlice({
    name: 'themes',
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<string>) => {
            state.mode = action.payload;
        },
        setColor: (state, action: PayloadAction<string>) => {
            state.color = action.payload;
        }
    }
});

export const {
    setColor,
    setMode
} = themesSlice.actions;
export default themesSlice.reducer;
export const selectThemes = (state: RootState) => state.themes;