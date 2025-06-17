import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import { AdminRoute } from './auth/AdminRoute';

import InventoryPage from './pages/InventoryPage';
import RequestPage from './pages/RequestPage';
import AdminPage from './pages/AdminPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <nav
        style={{
          padding: '1rem',
          background: '#222',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Link to="/" style={{ marginRight: '1rem', color: 'white' }}>
            Home
          </Link>
          <Link to="/inventory" style={{ marginRight: '1rem', color: 'white' }}>
            Inventory
          </Link>
          <Link to="/request" style={{ marginRight: '1rem', color: 'white' }}>
            Request Part
          </Link>

          {user && !!user.isAdmin && (
            <>
              <Link to="/admin" style={{ color: 'white' }}>
                Admin Dashboard
              </Link>
              <Link to="/admin/requests" style={{ marginLeft: '1rem', color: 'white' }}>
                Admin Requests
              </Link>
            </>
          )} 
        </div>

        <div>
          {!user ? (
            <>
              <Link
                to="/register"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50',
                  borderRadius: '4px',
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '0.5rem',
                }}
              >
                Register
              </Link>
              <Link
                to="/login"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2196F3',
                  borderRadius: '4px',
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: '1rem' }}>
                Hello, {user.username}!
              </span>
              <LogoutButton />
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/request" element={<RequestPage />} />

        {/* Protect admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <AdminRoute>
              <AdminRequestsPage />
            </AdminRoute>
          }
        />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

// Move this outside App and use useNavigate here
import { useNavigate } from 'react-router-dom';


function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <button onClick={handleLogout} 
    style={{
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      >
      Logout
    </button>
  );
}

function Home() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Welcome to Mechanic AutoParts</h1>
      <p>Please use the navigation above to browse inventory, request parts, or manage stock.</p>
    </div>
  );
}
