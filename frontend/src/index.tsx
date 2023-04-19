import React from 'react';
import ReactDOM from 'react-dom';

import { store } from './app/store';
import { Provider } from 'react-redux';

import './autofill.css';

import App from './App';
import { CssBaseline } from '@mui/material';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <CssBaseline />
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
