import React, { useState } from 'react';
import axios from 'axios';
import './css/styles.css';

export default function AdminPage() {
  const [partName, setPartName] = useState('');
  const [description, setDescription] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [stock, setStock] = useState(0);
  const [canOrder, setCanOrder] = useState(true);
  const [message, setMessage] = useState('');

  
  const handleAddPart = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await axios.post('/api/inventory/add', {
        part_name: partName.trim(),
        make: make.trim(),
        model: model.trim(),
        year: year.trim(),
        description: description.trim(),
        stock,
        can_order: canOrder,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Part added successfully!');
      setPartName('');
      setDescription('');
      setMake('');
      setModel('');
      setYear('');
      setStock(0);
      setCanOrder(true);
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage('Failed to add part.');
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard - Add Inventory Part</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleAddPart} className="form-section">
        
        <label>
          Part Name:
          <input
            type="text"
            value={partName}
            onChange={e => setPartName(e.target.value)}
            placeholder="Part Name"
            required
          />
        </label>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <label style={{ flex: 1 }}>
            Make:
            <input
              type="text"
              value={make}
              onChange={e => setMake(e.target.value)}
              placeholder="Make"
              required
            />
          </label>

          <label style={{ flex: 1 }}>
            Model:
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="Model"
              required
            />
          </label>

          <label style={{ flex: 1 }}>
            Year:
            <input
              type="number"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Year"
              required
            />
          </label>
        </div>

        <label>
          Description:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            cols={50}
            placeholder="Details about the new part"
            required
          />
        </label>

        <label>
          Stock Quantity:
          <input
            type="number"
            value={stock}
            onChange={e => setStock(Number(e.target.value))}
            min={0}
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

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}
