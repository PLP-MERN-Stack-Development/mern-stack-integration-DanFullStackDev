// src/components/Layout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import { Button } from '@/components/ui/button'; // 2. Import Button

const Layout = () => {
  // 3. Get the user and logout function from context
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4 flex justify-between items-center">
        {/* Main navigation links */}
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-blue-500 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/create-post" className="text-green-600 hover:underline">
              Create Post
            </Link>
          </li>
        </ul>

        {/* 4. Auth links (Login/Register or Welcome/Logout) */}
        <div className="flex items-center space-x-4">
          {user ? (
            // If user is logged in
            <>
              <span className="text-gray-700">Welcome, {user.username}!</span>
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            </>
          ) : (
            // If user is logged out
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      <hr className="mb-4" />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;