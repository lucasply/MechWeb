import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import InventoryPage from './pages/InventoryPage';
import RequestPage from './pages/RequestPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#222', color: 'white' }}>
        <Link to="/" style={{ marginRight: '1rem', color: 'white' }}>Home</Link>
        <Link to="/inventory" style={{ marginRight: '1rem', color: 'white' }}>Inventory</Link>
        <Link to="/request" style={{ marginRight: '1rem', color: 'white' }}>Request Part</Link>
        <Link to="/admin" style={{ color: 'white' }}>Admin Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
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
