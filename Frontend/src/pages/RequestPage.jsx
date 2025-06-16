import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RequestPage() {
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/inventory')
      .then(res => setParts(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/requests', {
        part_id: selectedPart,
        description,
        // Include user id from auth here if you add login
      });
      setMessage('Request submitted successfully!');
      setSelectedPart('');
      setDescription('');
    } catch (err) {
      setMessage('Failed to submit request.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Request a Part or Maintenance</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Select Part:
          <select value={selectedPart} onChange={e => setSelectedPart(e.target.value)} required>
            <option value="">--Choose a part--</option>
            {parts.map(part => (
              <option key={part.id} value={part.id}>
                {part.part_name} {part.stock === 0 ? '(Out of stock)' : ''}
              </option>
            ))}
          </select>
        </label>

        <br /><br />

        <label>
          Describe your request:
          <br />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            cols={50}
            placeholder="Details about your request"
            required
          />
        </label>

        <br /><br />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}
