const express = require('express');
const pool = require('../db');
const router = express.Router();

// Admin-only route - add validation later
router.post('/add', async (req, res) => {
  const { part_name, description, stock, can_order } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO inventory (part_name, description, stock, can_order) VALUES (?, ?, ?, ?)',
      [part_name, description, stock, can_order]
    );

    res.status(201).json({ message: 'Part added', partId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add part' });
  }
});

module.exports = router;
