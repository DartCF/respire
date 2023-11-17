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
      {/* ADD REGISTRY API PATH BELOW */}
      <App applicationName={"RESPIRE"} registryAPIPath={""} documentationURL={"https://github.com/DartCF/respire/wiki"}/>
    </Provider>
  </React.StrictMode>
);
