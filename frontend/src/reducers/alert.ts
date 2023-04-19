import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

import { AppDispatch } from '../app/store';
import { Wait } from '../util/misc';

type AlertType = "success" | "info" | "warning" | "error";

export interface NewAlert {
    type: AlertType,
    text: string,
    timeout?: number,
}

interface Alert {
    id: number,
    type: AlertType,
    text: string,
}

let currentAlertID = 0;

const initialState: Alert[] = [];

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        newAlert: (state: Alert[], action: PayloadAction<Alert>) => {
            const alert = action.payload;
            return [ ...state, alert];

        },
        deleteAlert: (state: Alert[], action: PayloadAction<number>) => {
            const id = action.payload;
            return state.filter(alert => alert.id !== id);
        }
    },
});

export const { newAlert, deleteAlert } = alertSlice.actions;

export const dispatchAlert = async (dispatch: AppDispatch, alert: NewAlert) => {
    const { type, text } = alert;
    const id = currentAlertID++;
    const timeout = alert.timeout || 10;
    dispatch(newAlert({ 
        id,
        type, 
        text,
    }));
    await Wait(timeout * 1000);
    dispatch(deleteAlert(id));
}

export const selectAlerts = (state: RootState) => state.alert;

export default alertSlice.reducer;
