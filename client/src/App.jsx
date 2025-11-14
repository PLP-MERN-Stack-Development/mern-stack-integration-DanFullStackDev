// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import PostFormPage from './pages/PostFormPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; // 1. Import ProtectedRoute

function App() {
  return (
    <Routes>
      {/* Routes WITH the main layout (navbar, etc.) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="post/:id" element={<PostPage />} />

        {/* 2. Create a new ProtectedRoute group */}
        <Route element={<ProtectedRoute />}>
          <Route path="create-post" element={<PostFormPage />} />
          <Route path="post/edit/:id" element={<PostFormPage />} />
        </Route>
      </Route>

      {/* Routes WITHOUT the main layout */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;