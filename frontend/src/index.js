import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import './index.css';
import './static/i18n';
import {AuthProvider} from "./AuthProvider";

ReactDOM.render(
    <Router>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </Router>,
    document.getElementById('root')
);
