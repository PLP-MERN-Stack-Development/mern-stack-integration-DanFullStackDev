// src/pages/PostFormPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
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
  // 1. Get :id from URL if it exists
  const { id } = useParams();
  const isEditMode = Boolean(id); // True if we are editing, false if creating

  // 2. Fetch categories for the dropdown (same as before)
  const { data: categoriesData, loading: categoriesLoading } = useFetch('/api/categories');

  // 3. Fetch post data ONLY if in edit mode
  const { data: postData } = useFetch(isEditMode ? `/api/posts/${id}` : null);

  // 4. Setup state for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);

  // 5. Setup state for form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 6. UseEffect to populate form when post data loads in edit mode
  useEffect(() => {
    if (isEditMode && postData) {
      setTitle(postData.data.title);
      setContent(postData.data.content);
      setCategory(postData.data.category._id); // We need the category ID
    }
  }, [isEditMode, postData]);

  // 7. Handle form submission (now handles CREATE and UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!title || !content || !category) {
      setError('All fields are required.');
      setSubmitting(false);
      return;
    }
    let featuredImage = postData?.data?.featuredImage;
    

    try {

      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
        const { data: uploadData } = await axios.post('/api/upload', formData, config);
        featuredImage = uploadData.data.imagePath; // Get the new image path
      }
      const postPayload = { title, content, category, featuredImage };
      


      if (isEditMode) {
        // UPDATE (PUT) request
        const { data: postResponse } = await axios.put(`/api/posts/${id}`, postPayload);
        navigate(`/post/${postResponse.data._id}`); // Go to the post page
      } else {
        // CREATE (POST) request
        const { data: postResponse } = await axios.post('/api/posts', postPayload);
        navigate(`/post/${postResponse.data._id}`); // Go to the new post's page
      }
      setSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit post');
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        {/* 8. Dynamic title */}
        <CardTitle>{isEditMode ? 'Edit Your Post' : 'Create a New Post'}</CardTitle>
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
              value={category} // This will now be set by our useEffect
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
                {/* 4. ADD FILE INPUT FIELD */}
          <div className="space-y-2">
            <Label htmlFor="image">Featured Image</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => setFile(e.target.files[0])} // Set the file in state
              disabled={submitting}
            />
            {isEditMode && !file && postData?.data?.featuredImage && (
              <p className="text-sm text-muted-foreground">
                Current image: {postData.data.featuredImage}
              </p>
            )}
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

          {/* 9. Dynamic button text */}
          <Button type="submit" disabled={submitting}>
            {submitting
              ? (isEditMode ? 'Updating...' : 'Creating...')
              : (isEditMode ? 'Update Post' : 'Create Post')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostFormPage;