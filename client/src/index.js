import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // ✅ Import App.css directly here (optional)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
