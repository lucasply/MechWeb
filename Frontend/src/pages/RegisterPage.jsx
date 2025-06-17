import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider'; // Adjust path as needed
import './css/RegisterPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    try {
      await register(formData.username, formData.email, formData.password);
      setIsSuccess(true);
      setMessage('Account created successfully! You can now log in.');
      setFormData({ username: '', email: '', password: '' }); // Clear form on success
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
      {message && (
        <p className={`register-message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      {isSuccess && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a href="/login" style={{ color: '#2196F3', textDecoration: 'none' }}>
            Click here to log in
          </a>
        </div>
      )}
    </div>
  );
}
