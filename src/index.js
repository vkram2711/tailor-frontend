import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import authConfig from './auth_config.json';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { themes } from './context/theme';

ReactDOM.render(
  <Auth0Provider
    domain={authConfig.domain}
    clientId={authConfig.clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: authConfig.audience
    }}
  >
    <ThemeProvider theme={themes.light}>
      <App />
    </ThemeProvider>
  </Auth0Provider>,
  document.getElementById('root')
);