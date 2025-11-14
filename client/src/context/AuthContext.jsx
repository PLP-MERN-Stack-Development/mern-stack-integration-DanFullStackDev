// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 1. Create the logout function
  const logout = async () => {
    try {
      // Call the backend logout route
      await axios.post('/api/auth/logout');
      // Set the user state to null
      setUser(null);
      // Redirect to the login page
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    // 2. Pass the 'logout' function in the value
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};