import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './redux/store';
import {Provider} from "react-redux";
import AuthProvider from './services/AuthProvider';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <AuthProvider>
      <Provider store={store}>
      <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
