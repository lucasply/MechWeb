import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import './css/LoginPage.css';
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/'); // Redirect after login success
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
        <h2>Log In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Username Or Email</label>
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
        <button type="submit" className="login-form-button">Log In</button>
        </form>
        {error && <p className="login-error">{error}</p>}
    </div>
    );

}
