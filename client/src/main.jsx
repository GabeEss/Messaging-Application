import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/main.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH_DOMAIN}
      clientId={import.meta.env.VITE_AUTH_CLIENT_ID}
      redirectUri={`https://gabe-messaging-application.netlify.app/`}
      audience={import.meta.env.VITE_AUTH_AUDIENCE}
      scope="openid profile email"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
