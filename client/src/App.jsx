// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import PostFormPage from './pages/PostFormPage'; // 1. Import the new page

function App() {
  return (
    <Routes>
      {/* This Route uses the Layout component */}
      <Route path="/" element={<Layout />}>
        {/* The child routes render inside the Layout's <Outlet /> */}
        <Route index element={<HomePage />} />
        <Route path="post/:id" element={<PostPage />} />
        {/* Add more routes here later, like for creating/editing posts */}
        <Route path="create-post" element={<PostFormPage />} /> {/* 2. Add this route */}
      </Route>
    </Routes>
  );
}

export default App;