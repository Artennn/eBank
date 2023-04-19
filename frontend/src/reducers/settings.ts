import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface SettingsState {
    darkTheme: boolean,
}

const initialState: SettingsState = {
    darkTheme: false,
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        changeSetting: (state: SettingsState, action: PayloadAction<Partial<SettingsState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { changeSetting } = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
