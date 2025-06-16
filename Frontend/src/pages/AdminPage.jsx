import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

export default function AdminPage() {
  const [partName, setPartName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(0);
  const [canOrder, setCanOrder] = useState(true);
  const [message, setMessage] = useState('');

  const handleAddPart = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/inventory/add', {
        part_name: partName,
        description,
        stock,
        can_order: canOrder,
      });
      setMessage('Part added successfully!');
      setPartName('');
      setDescription('');
      setStock(0);
      setCanOrder(true);
    } catch (err) {
      setMessage('Failed to add part.');
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard - Add Inventory Part</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleAddPart}>
        <label>
          Part Name:
          <input
            type="text"
            value={partName}
            onChange={e => setPartName(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <label>
          Stock Quantity:
          <input
            type="number"
            value={stock}
            min={0}
            onChange={e => setStock(parseInt(e.target.value) || 0)}
            required
          />
        </label>

        <label>
          Can Order:
          <input
            type="checkbox"
            checked={canOrder}
            onChange={e => setCanOrder(e.target.checked)}
          />
        </label>

        <button type="submit">Add Part</button>
      </form>
    </div>
  );
}
