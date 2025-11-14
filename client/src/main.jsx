// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Import
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // 1. Import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap App with BrowserRouter */}
    <BrowserRouter>
    {/* 2. Add the AuthProvider wrapper here */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);