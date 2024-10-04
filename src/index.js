import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';  // Ensure this line exists
import { ModeProvider } from './Context';
const root = createRoot(document.getElementById('root'));

root.render(

<Auth0Provider
    domain="dev-8z3agy7sryyg0ev2.us.auth0.com"
    clientId="r2E4UBUkb5flJRe3Ybyv01hHEXsTi1v7"
    authorizationParams={{
      redirect_uri: "http://localhost:3000/"
    }}
  >
    <ModeProvider>
    <App />
    </ModeProvider>
  </Auth0Provider>,
);