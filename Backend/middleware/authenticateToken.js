const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Get the token from Authorization header: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // split on space, get token part

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach decoded user payload (from token) to req.user
    req.user = user;
    next(); // move to next middleware or route handler
  });
}

module.exports = authenticateToken;
