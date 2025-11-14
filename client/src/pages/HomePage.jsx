// src/pages/HomePage.jsx
import React from 'react';
import useFetch from '../hooks/useFetch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Import shadcn card
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Use our custom hook to fetch posts
  // The URL is just '/api/posts' thanks to our Vite proxy
  const { data: postsData, loading, error } = useFetch('/api/posts');

  // Handle Loading State
  if (loading) {
    return <div>Loading posts...</div>;
  }

  // Handle Error State
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Handle Success State
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsData && postsData.data.length > 0 ? (
          postsData.data.map((post) => (
            <Card key={post._id} className="flex flex-col">
              {post.featuredImage && (
                <img
                  src={`http://localhost:5000${post.featuredImage}`}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  By {post.author.username} in {post.category.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{post.excerpt || 'No excerpt available.'}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link
                  to={`/post/${post._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <p>No posts found. Go create one!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;