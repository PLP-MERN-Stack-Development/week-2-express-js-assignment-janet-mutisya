// server.js - Starter Express server for Week 2 assignment
// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const productRoutes = require('./routes/products');



const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
// middleware to parse data
app.use('/api/products', productRoutes);

// - Request logging 
const apiKeyMiddleware = require('./middleware/middleware');

// Middleware setup 
app.use((req, res, next) => {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url}`);

  // Pass control to the next middleware/route
  next();
});

// Sample in-memory products database
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

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// API routes for products
// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});
// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const productId = products.find(p => p.id === req.params.id);
  if(productId){
    res.json(productId)}
  else {
    res.status(404).json({ error: 'product not found'})
    }
  }
);
// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: uuidv4(), // generates a unique ID
    ...req.body  //spreads the request body into the new product object
};
products.push(newProduct);
res.status(201).json(newProduct);

})

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  // find the index of the product to update
  const productIndex = products.findIndex(p => String(p.id) === String(productId));

//if the product not found return 404
  if (productIndex === -1) {
    return res.status(404).json({error: 'product not found'})};

    const updatedProduct = {
      ...products[productIndex],
      ...req.body 
    } ;

     // Replace the old product with the updated one
    products[productIndex] = updatedProduct;
  
    // Send the updated product back
    res.json(updatedProduct);

  }
)
// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  //get the id from request parameter
  const productId = req.params.id
// find the index of the product to delete
const productIndex = products.findIndex(p => String(p.id) === String(productId))
//if product not found return 404
 if (productIndex === -1) {
  return res.status(404).json({ error: 'product not found'})
   }
   // remove product from the list
   const removeProduct = products.splice(productIndex , 1);

   //send back the message
   res.json({message: 'product deleted successfully'})
})


// Apply middleware only to protected routes
app.get('/protected', apiKeyMiddleware, (req, res) => {
  res.json({ message: 'You have access to the protected route' });
});


// TODO: Implement custom middleware for:

// - Authentication
app.get('/', (req, res) => {
  res.send('Welcome! Authenticated successfully.');
});
// - Error handling
const errorHandler = require('./middleware/errorHandler');

// Use the error-handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 