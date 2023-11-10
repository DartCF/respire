import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'
import { store } from './store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App applicationName={"RESPIRE"} />
    </Provider>
  </React.StrictMode>
);