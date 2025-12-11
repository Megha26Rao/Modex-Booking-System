// /frontend/src/index.tsx - CRITICALLY CORRECT WRAPPING ORDER
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App';
import { ShowProvider } from './context/ShowContext'; 
import { AuthProvider } from './context/AuthContext'; // Must be imported

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* CRITICAL FIX: The AuthProvider MUST be the outermost context */}
    <AuthProvider> 
      <ShowProvider> 
        <App />
      </ShowProvider>
    </AuthProvider>
  </React.StrictMode>
);

