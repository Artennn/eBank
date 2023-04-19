import { configureStore, ThunkAction, Action, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';

import app from '../reducers/app';
import settings from '../reducers/settings';
import alert from '../reducers/alert';

import user from '../reducers/user';
import currentAccount from '../reducers/currentAccount';
import transfer from '../reducers/transfer';
import definedTransfers from '../reducers/definedTransfers';
import recipients from '../reducers/recipients';

const combinedReducers = combineReducers({
    app,
    settings,
    alert,
    user,
    currentAccount,
    transfer,
    definedTransfers,
    recipients,
})

const rootReducer = (state: any, action: any) => {
    if (action.type === 'user/logout') {
        //const alerts = state.alerts
        state = {};
        //state.alert = alerts
    }
    return combinedReducers(state, action);
}

// allows us to use Dates in state
const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: customizedMiddleware,
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
