import React, { useState, useEffect } from 'react';

export default function RequestForm() {
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Fetch parts from backend
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => setParts(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        part_id: selectedPart,
        description,
        // You’d probably attach user id from auth here
      }),
    });

    if (res.ok) {
      alert('Request submitted!');
      setSelectedPart('');
      setDescription('');
    } else {
      alert('Error submitting request.');
    }
  };

  return (
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

      <label>
        Request Details:
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe your issue or request"
          required
        />
      </label>

      <button type="submit">Submit Request</button>
    </form>
  );
}
