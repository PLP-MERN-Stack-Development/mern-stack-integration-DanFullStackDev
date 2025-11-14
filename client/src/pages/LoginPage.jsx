// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth

const LoginPage = () => {
  const { setUser } = useAuth();  // 2. Get setUser from context
  // Setup state for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Setup state for form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!email || !password) {
      setError('Both email and password are required');
      setSubmitting(false);
      return;
    }

    try {
      // 1. Send data to the backend login route
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      setUser(response.data.data); 
      // 2. Handle success (redirect to home)
      setSubmitting(false);
      navigate('/'); // Go to the homepage
    } catch (err) {
      // 3. Handle errors (like 'Invalid email or password')
      setError(err.response?.data?.error || 'Login failed');
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Login to Your Account</CardTitle>
        <CardDescription>Enter your email and password to sign in.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Submit Button */}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;