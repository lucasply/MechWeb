const express = require('express');
const router = express.Router();
const pool = require('../db');
const xss = require('xss');

// Submit a new request
router.post('/', async (req, res) => {
  try {
    const user_id = req.body.user_id; // you can implement auth later
    const part_id = req.body.part_id;
    const description = xss(req.body.description);

    await pool.query(
      'INSERT INTO requests (user_id, part_id, description) VALUES (?, ?, ?)',
      [user_id, part_id, description]
    );

    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

router.post('/new-part', async (req, res) => {
  try {
    const user_id = req.body.user_id; // you can implement auth later
    const make = xss(req.body.make?.trim() || '');
    const model = xss(req.body.model?.trim() || '');
    const year = xss(req.body.year?.trim() || '');
    const part_name = xss(req.body.part_name.trim() || '');
    const description = xss(req.body.description);

    await pool.query(
      'INSERT INTO requests (user_id, part_name, make, model, year, description) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, part_name, make, model, year, description]
    );

    res.status(201).json({ message: 'New part request submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit new part request' });
  }
});

router.get('/new-requests', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, u.username AS user_name
      FROM requests r
      JOIN users u ON r.user_id = u.id
      WHERE r.part_id IS NULL
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch new part requests' });
  }
});

// PATCH: Update request status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    await pool.query(
      'UPDATE requests SET status = ? WHERE id = ?',
      [status, id]
    );
    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
