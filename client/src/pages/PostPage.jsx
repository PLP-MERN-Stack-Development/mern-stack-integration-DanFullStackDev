// src/pages/PostPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Import shadcn card

const PostPage = () => {
  // 1. Get the 'id' from the URL
  const { id } = useParams();

  // 2. Fetch the single post using the id
  const { data: postData, loading, error } = useFetch(`/api/posts/${id}`);

  // Handle Loading State
  if (loading) {
    return <div>Loading post...</div>;
  }

  // Handle Error State
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Handle Success State
  return (
    <div>
      {postData && postData.data ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{postData.data.title}</CardTitle>
            <CardDescription>
              By {postData.data.author.username} in {postData.data.category.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* This is where the full blog post content will go */}
            <div className="prose max-w-none">
              <p>{postData.data.content}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p>Post not found.</p>
      )}
    </div>
  );
};

export default PostPage;