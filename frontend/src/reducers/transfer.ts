import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

import { Account } from '../interfaces/account';
import { Transfer, TransferInfo, definedTransfer, emptyTransfer } from '../interfaces/transfer';
import { Recipient } from '../interfaces/recipient';
import { startOfDay } from 'date-fns';

const initialState = emptyTransfer;

export const transferSlice = createSlice({
    name: 'transfer',
    initialState,
    reducers: {
        clearTransfer: () => {
            return emptyTransfer;
        },
        updateTarget: (state: Transfer, action: PayloadAction<Partial<Account>>) => {
            state.targetAccount = { ...state.targetAccount, ...action.payload };
        },
        updateInfo: (state: Transfer, action: PayloadAction<Partial<TransferInfo>>) => {
            state.transferInfo = { ...state.transferInfo, ...action.payload };
        },
        setDefined: (state: Transfer, action: PayloadAction<definedTransfer>) => {
            const { targetAccount, transferInfo } = action.payload;
            state.targetAccount = targetAccount;
            const date = new Date(transferInfo.date) < startOfDay(new Date())
                ? new Date()
                : state.transferInfo.date
            state.transferInfo = { ...transferInfo, date };
        },
        setRecipient: (state: Transfer, action: PayloadAction<Recipient>) => {
            const { account } = action.payload;
            state.targetAccount = account;
        },
    },
});

export const { clearTransfer, updateTarget, updateInfo, setDefined, setRecipient } = transferSlice.actions;

export const currentAccount = (state: RootState) => state.transfer;

export default transferSlice.reducer;