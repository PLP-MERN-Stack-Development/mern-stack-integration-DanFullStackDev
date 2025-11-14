// src/pages/PostPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom'; // 1. Import Link
import useFetch from '../hooks/useFetch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // 2. Import Button

const PostPage = () => {
  const { id } = useParams();
  const { data: postData, loading, error } = useFetch(`/api/posts/${id}`);

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      {postData && postData.data ? (
        <Card>
          {postData.data.featuredImage && (
            <img
              src={`http://localhost:5000${postData.data.featuredImage}`}
              alt={postData.data.title}
              className="w-full h-72 object-cover rounded-t-xl mb-4"
            />
          )}
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl">{postData.data.title}</CardTitle>
                <CardDescription>
                  By {postData.data.author.username} in {postData.data.category.name}
                </CardDescription>
              </div>
              {/* 3. Add this Link, wrapped in a Button */}
              <Link to={`/post/edit/${id}`}>
                <Button variant="outline">Edit Post</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
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