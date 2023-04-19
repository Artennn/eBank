import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

import { Account, emptyAccount } from '../interfaces/account';

export const currentAccountSlice = createSlice({
    name: 'currentAccount',
    initialState: emptyAccount,
    reducers: {
        setCurrentAccount: (state: Account, action: PayloadAction<Account>) => {
            return action.payload;
        },
    },
});

export const { setCurrentAccount } = currentAccountSlice.actions;

export const currentAccount = (state: RootState) => state.currentAccount;

export default currentAccountSlice.reducer;
