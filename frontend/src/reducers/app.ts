import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../App';
import { RootState } from '../app/store';

interface AppState {
    page: Page,
    sidebarExpanded: boolean,
    sidebarChildrenExpanded: boolean,
}

const initialState: AppState = {
    page: 'dashboard',
    sidebarExpanded: true,
    sidebarChildrenExpanded: true,
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        changePage: (state: AppState, action: PayloadAction<Page>) => {
            state.page = action.payload;
        },
        toggleSideBar: (state: AppState, action: PayloadAction<boolean | null>) => {
            state.sidebarExpanded = action?.payload !== null
                ? action.payload : !state.sidebarExpanded;
        },
        toggleSideBarChildren: (state: AppState, action: PayloadAction<boolean | null>) => {
            state.sidebarChildrenExpanded = action?.payload !== null
                ? action.payload : !state.sidebarChildrenExpanded;
        },
    },
});

export const { changePage, toggleSideBar, toggleSideBarChildren } = appSlice.actions;

export const selectApp = (state: RootState) => state.app;

export default appSlice.reducer;
