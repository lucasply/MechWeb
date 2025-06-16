const xss = require('xss');

router.post('/requests', async (req, res) => {
  try {
    const cleanDescription = xss(req.body.description);
    // sanitize other inputs as needed

    // Now save cleanDescription to DB instead of raw input
    await pool.execute(
      'INSERT INTO requests (user_id, part_id, description) VALUES (?, ?, ?)',
      [req.body.user_id, req.body.part_id, cleanDescription]
    );

    res.status(201).json({ message: 'Request submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit request' });
  }
});