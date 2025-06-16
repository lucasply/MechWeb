import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminRequestsPage.css';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/requests/new-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/requests/${id}/status`, { status });
      fetchRequests(); // Refresh data
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="admin-requests-container">
      <h2>New Part Requests</h2>
      <table className="admin-requests-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Part Name</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Description</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr><td colSpan="9">No new part requests found.</td></tr>
          ) : (
            requests.map(req => (
              <tr key={req.id}>
                <td>{req.user_name || req.user_id}</td>
                <td>{req.part_name}</td>
                <td>{req.make}</td>
                <td>{req.model}</td>
                <td>{req.year}</td>
                <td>{req.description}</td>
                <td>{req.status}</td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
                <td>
                  {req.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(req.id, 'in_progress')}>Start</button>
                      <button onClick={() => updateStatus(req.id, 'cancelled')}>Cancel</button>
                    </>
                  )}
                  {req.status === 'in_progress' && (
                    <button onClick={() => updateStatus(req.id, 'completed')}>Complete</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
