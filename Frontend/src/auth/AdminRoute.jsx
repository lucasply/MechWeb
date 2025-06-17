import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // Optional: handle loading state while checking auth
  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user || !user.isAdmin) {
    // If no user or user is not admin, redirect to home or login page
    return <Navigate to="/" replace />;
  }

  // User is admin, allow access
  return children;
}
