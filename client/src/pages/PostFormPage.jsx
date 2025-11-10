// src/pages/PostFormPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

// Import shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PostFormPage = () => {
  // 1. Fetch categories for the dropdown
  const { data: categoriesData, loading: categoriesLoading } = useFetch('/api/categories');

  // 2. Setup state for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  // 3. Setup state for form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 4. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form browser behavior
    setSubmitting(true);
    setError(null);

    // Simple validation
    if (!title || !content || !category) {
      setError('All fields are required.');
      setSubmitting(false);
      return;
    }

    try {
      // Create the new post object
      const newPost = {
        title,
        content,
        category,
        // The 'author' is being handled by our backend placeholder logic for now
      };

      // 5. Send data to the backend API
      const response = await axios.post('/api/posts', newPost);

      // 6. Redirect to the new post's page on success
      setSubmitting(false);
      navigate(`/post/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your post title"
              disabled={submitting}
            />
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => setCategory(value)}
              value={category}
              disabled={categoriesLoading || submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData?.data.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              rows={10}
              disabled={submitting}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Submit Button */}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostFormPage;