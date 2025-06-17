const express = require('express');
const router = express.Router();
const pool = require('../db');
const xss = require('xss');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeAdmin = require('../middleware/authorizeAdmin');



// Get all inventory parts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inventory');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Add a new part (admin only)
router.post('/add', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    console.log('Add part request body:', req.body);
    const part_name = xss(req.body.part_name);
    const description = xss(req.body.description);
    const stock = parseInt(req.body.stock) || 0;
    const can_order = req.body.can_order ? 1 : 0;
    const make = xss(req.body.make);
    const model = xss(req.body.model);
    const year = req.body.year
    await pool.query(
      'INSERT INTO inventory (part_name, make, model, year, description, stock, can_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [part_name, make, model, year, description, stock, can_order]
    );

    res.status(201).json({ message: 'Part added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add part' });
  }
});


module.exports = router;