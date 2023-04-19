import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

import { User, emptyUser } from '../interfaces/user';

const initialState = emptyUser;

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state: User, action: PayloadAction<User>) => {
            return action.payload;
        },
        logout: (state: User) => {
            // resets whole state
            // handled in store.ts
        },
    },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
