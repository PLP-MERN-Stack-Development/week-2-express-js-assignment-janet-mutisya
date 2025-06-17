const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory products data (or you can import from server.js if needed)
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// All routes below
router.get('/', (req, res) => {
  const { category, page = 1, limit = 2 } = req.query;

  let filteredProducts = products;

  if (category) {
    filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit);
  const paginated = filteredProducts.slice(startIndex, endIndex);

  res.json({
    page: Number(page),
    limit: Number(limit),
    total: filteredProducts.length,
    data: paginated
  });
});
// get products by id
router.get('/search', (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Provide name to search' });

  const result = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  res.json(result);
});

router.get('/stats', (req, res) => {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
});

// Export the router
module.exports = router;

