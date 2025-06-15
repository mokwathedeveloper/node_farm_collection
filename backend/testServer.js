const express = require('express');
const app = express();

// Parse JSON request body
app.use(express.json());

// Simple root route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

// Simple POST route
app.post('/test', (req, res) => {
  res.json({ 
    message: 'Test POST route is working!',
    receivedData: req.body 
  });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});