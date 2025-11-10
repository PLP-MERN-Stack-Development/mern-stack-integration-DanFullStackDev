// src/components/Layout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-blue-500 hover:underline">
              Home
            </Link>
          </li>
          {/* Add this new Link */}
          <li>
            <Link to="/create-post" className="text-green-600 hover:underline">
              Create Post
            </Link>
          </li>
        </ul>
      </nav>
      <hr className="mb-4" />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;