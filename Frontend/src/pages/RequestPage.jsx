import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RequestPage.css';

export default function RequestPage() {
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState('');
  const [newPartName, setNewPartName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    let filtered = parts;

    if (make) {
      filtered = filtered.filter(part => part.make === make);
    }
    if (model) {
      filtered = filtered.filter(part => part.model === model);
    }
    if (year) {
      filtered = filtered.filter(part => part.year.toString() === year.toString());
    }

    setFilteredParts(filtered);
  }, [make, model, year, parts]);


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
  const handleNewPartRequest = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/requests/new-part', {
        part_name: newPartName,
        make,
        model,
        year,
        description,
      });

      setMessage('New part request submitted successfully!');
      setNewPartName('');
      setMake('');
      setModel('');
      setYear('');
      setDescription('');
    } catch (err) {
      setMessage('Failed to submit new part request.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Request a Part or Maintenance</h2>
        <br /><br />
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit} className="form-section">
          <h3>Request an Existing Part</h3>
      
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ flex: 1 }}>
                Make:
                <select value={make} onChange={e => setMake(e.target.value)}>
                  <option value="">All</option>
                  {[...new Set(parts.map(p => p.make))].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>

              <label style={{ flex: 1 }}>
                Model:
                <select value={model} onChange={e => setModel(e.target.value)} disabled={!make}>
                  <option value="">All</option>
                  {[...new Set(parts.filter(p => p.make === make).map(p => p.model))].map(mo => (
                    <option key={mo} value={mo}>{mo}</option>
                  ))}
                </select>
              </label>

              <label style={{ flex: 1 }}>
                Year:
                <select value={year} onChange={e => setYear(e.target.value)} disabled={!model}>
                  <option value="">All</option>
                  {[...new Set(parts
                    .filter(p => p.make === make && p.model === model)
                    .map(p => p.year))].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </label>
            </div>

          <label style={{ display: 'block', marginBottom: '1rem' }}>
            Select Part:
            <select
              value={selectedPart}
              onChange={e => setSelectedPart(e.target.value)}
              required
              style={{ width: '100%', marginTop: '0.25rem' }}
            >
              <option value="">Select Part</option>
              {filteredParts.map(part => (
                <option key={part.id} value={part.id}>
                  {part.part_name} ({part.make} {part.model} {part.year}) {part.stock === 0 ? '(Out of stock)' : ''}
                </option>
              ))}
            </select>
                </label>
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
            
            <button type="submit">Submit Request</button>
        </form>

      <br /><br />

      <form onSubmit={handleNewPartRequest} className="form-section">
        <h3>Request a New Part</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            New Part Name:
            <input
              type="text"
              value={newPartName}
              onChange={e => setNewPartName(e.target.value)}
              required
              style={{ width: '100%', marginTop: '0.25rem' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <label style={{ flex: 1 }}>
            Make:
            <input
              type="text"
              value={make}
              onChange={e => setMake(e.target.value)}
              required
              style={{ width: '100%', marginTop: '0.25rem' }}
            />
          </label>
          <label style={{ flex: 1 }}>
            Model:
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              required
              style={{ width: '100%', marginTop: '0.25rem' }}
            />
          </label>
          <label style={{ flex: 1 }}>
            Year:
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              required
              style={{ width: '100%', marginTop: '0.25rem' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Description:
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ width: '100%', marginTop: '0.25rem' }}
              placeholder="Details about the part or issue"
              required
            />
          </label>
        </div>

        <button type="submit">Request New Part</button>
      </form>

    </div>
  );
}
