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

module.exports = router;
