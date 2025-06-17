import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On app start, check if token exists and fetch user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          console.log('Fetched user from /me:', data.user); // <-- check this
          setUser(data.user);
        })
        .catch(() => logout());
    }
  }, []);
  async function register(username, email, password) {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await res.json();

    // Optionally: If backend returns a token and user data, you can set it here
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
    }

    return data;
  }
  // Login function calls backend and stores token + user
  const login = async (email, password) => {
    console.log('Login attempt:', { email, password });
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: email, password }),
    });
    if (!res.ok) {
      throw new Error('Login failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    console.log(data.user);
    setUser(data.user);
    
  };

  // Logout clears user and token
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
