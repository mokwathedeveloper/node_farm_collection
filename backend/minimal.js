const express = require('express');
const app = express();

// Parse JSON request body
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Minimal server is running!' });
});

// Auth test route
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth test route is working!' });
});

// Setup superadmin route
app.post('/api/auth/setup-superadmin', (req, res) => {
  res.json({ 
    message: 'Setup superadmin route is working!',
    receivedData: req.body 
  });
});

// Start server
const PORT = 5004;
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});