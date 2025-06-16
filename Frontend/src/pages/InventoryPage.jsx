import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function InventoryPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/inventory')
      .then(res => {
        setParts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Inventory</h2>
      {parts.length === 0 ? (
        <p>No parts available.</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Part Name</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Can Order</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(part => (
              <tr key={part.id}>
                <td>{part.part_name}</td>
                <td>{part.description}</td>
                <td>{part.stock}</td>
                <td>{part.can_order ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
