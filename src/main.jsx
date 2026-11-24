import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppConfigProvider } from './context/AppConfigContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppConfigProvider>
      <App />
    </AppConfigProvider>
  </React.StrictMode>
);
