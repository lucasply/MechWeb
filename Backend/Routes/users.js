const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const xss = require('xss');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; 
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register', async (req, res) => {
  try {
    const username = xss(req.body.username).trim();
    const email = xss(req.body.email).trim().toLowerCase();
    const password = req.body.password;
    console.log('Register attempt:', { username, email });
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Simple email format check (can use better regex or a validation lib)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const identifier = xss(req.body.identifier).trim(); // username or email
    const password = req.body.password;
    console.log('Login attempt:', { identifier, password });
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    // Fetch user by email or username
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or email' });
    }

    const user = rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Create JWT payload (you can add more fields if needed)
    const payload = { userId: user.id, username: user.username, isAdmin: user.is_admin };

    // Sign JWT token (expires in 1 day)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

  
  router.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
  });
module.exports = router;
