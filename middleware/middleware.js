


const API_KEY = process.env.API_KEY || 'my-secret-api-key';

const apiKeyMiddleware = (req, res, next) => {
  const userApiKey = req.headers['x-api-key'];

  if (userApiKey && userApiKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
};

module.exports = apiKeyMiddleware;
