
// middleware/authMiddleware.js

const API_KEY = process.env.API_KEY || 'default-key';

const authMiddleware = (req, res, next) => {
  const userKey = req.headers['x-api-key']; // Use custom header

  if (!userKey) {
    return res.status(401).json({ error: 'API key missing' });
  }

  if (userKey !== API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next(); // Valid API key, proceed
};

module.exports = authMiddleware;
